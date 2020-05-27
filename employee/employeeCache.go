package employee

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/byuoitav/pi-time/log"
	"github.com/byuoitav/pi-time/structs"
	"github.com/byuoitav/wso2services/wso2requests"
	bolt "go.etcd.io/bbolt"
)

//LogChannel channel to send log messages
var LogChannel chan string

const (
	EMPLOYEE_BUCKET = "EMPLOYEE"
)

func init() {
	LogChannel = make(chan string)

	dbLoc := os.Getenv("CACHE_DATABASE_LOCATION")

	if len(dbLoc) == 0 {
		log.P.Warn("Need CACHE_DATABASE_LOCATION variable")
	}
}

//WatchForCachedEmployees will start a timer and download the cache every 4 hours
func WatchForCachedEmployees(updateNowChan chan struct{}, db *bolt.DB) {
	for {
		_ = DownloadCachedEmployees(db)

		//wait for 4 hours and then do it again
		select {
		case <-time.After(4 * time.Hour):
			log.P.Info("4 hour timeout reached")
		case <-updateNowChan:
			log.P.Info("4 updating now")
		}
	}
}

//DownloadCachedEmployees makes a call to WSO2 to get the employee cache
func DownloadCachedEmployees(db *bolt.DB) error {
	var cacheList structs.EmployeeCache
	//make a WSO2 request to get the cache
	log.P.Debug("Making call to get employee cache")
	ne := wso2requests.MakeWSO2RequestWithHeaders("GET", "https://psws.byu.edu/PSIGW/BYURESTListeningConnector2/PSFT_HR/clock_employees.v1/", "", &cacheList, map[string]string{"sm_user": "timeclock"})

	if ne != nil {
		log.P.Error(fmt.Sprintf("Unable to get the cache list: %v", ne))
		return ne
	}

	//open our bolt db
	//initialize the bolt db
	log.P.Debug(fmt.Sprintf("Adding %v employees to the cache", len(cacheList.Employees)))

	err := db.Update(func(tx *bolt.Tx) error {
		//create punch bucket if it does not exist
		bucket := tx.Bucket([]byte(EMPLOYEE_BUCKET))
		if bucket != nil {
			err := tx.DeleteBucket([]byte(EMPLOYEE_BUCKET))
			if err != nil {
				log.P.Warn("failed to delete employeeBucket")
				return fmt.Errorf("error deleting the employee bucket: %s", err)
			}
		}
		log.P.Debug("Checking if employee Bucket Exists")

		_, err := tx.CreateBucketIfNotExists([]byte(EMPLOYEE_BUCKET))
		if err != nil {
			log.P.Warn("failed to create employeeBucket")
			return fmt.Errorf("error creating the employee bucket: %s", err)
		}
		return nil
	})

	if err != nil {
		return err
	}

	for _, employee := range cacheList.Employees {
		err := db.Batch(func(tx *bolt.Tx) error {
			employeeJSON, _ := json.Marshal(employee)

			bucket := tx.Bucket([]byte(EMPLOYEE_BUCKET))
			if bucket == nil {
				return fmt.Errorf("unable to get employee bucket")
			}

			return bucket.Put([]byte(employee.BYUID), employeeJSON)
		})

		if err != nil {
			log.P.Error(fmt.Sprintf("Unable to get the add to boltdb: %v", err))
			return err
		}
	}

	log.P.Debug("Successfully added employees to the bucket")

	return nil
}

//GetEmployeeFromCache looks up an employee in the cache
func GetEmployeeFromCache(byuID string, db *bolt.DB) (structs.EmployeeRecord, error) {

	var empRecord structs.EmployeeRecord

	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(EMPLOYEE_BUCKET))
		if b == nil {
			fmt.Print("cannot open employee bucket\n\n")
		}

		item := b.Get([]byte(byuID))
		if item == nil {
			//not found, return it
			return fmt.Errorf("unable to find the employee in the cache")
		}

		err := json.Unmarshal(item, &empRecord)
		if err != nil {
			fmt.Print("unable to unmarshal employee")
			return err
		}

		//no error in db.View
		return nil
	})

	if err != nil {
		//unable to retrieve from cache for whatever reason
		fmt.Printf("unable to retrieve from cache for reason: %s", err)
		return empRecord, err
	}

	return empRecord, nil
}
