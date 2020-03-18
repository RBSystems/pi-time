package handlers

import (
	"github.com/byuoitav/common/log"
	"github.com/byuoitav/pi-time/cache"
	"github.com/byuoitav/pi-time/ytimeapi"

	"github.com/labstack/echo/v4"
)

//LogInUser will authenticate a user, upgrade to websocket, and return the timesheet and offline mode to the web socket
func (y *YTime) LogInUser(context echo.Context) error {

	//upgrade the connection to a websocket
	webSocketClient := cache.ServeWebsocket(context.Response().Writer, context.Request())

	//get the id
	byuID := context.Param("id")
	log.L.Debugf("Logging in " + byuID)

	//get the timesheet for this guy
	timesheet, isOffline, err := ytimeapi.GetTimesheet(byuID)

	if err != nil {
		//return context.String(http.StatusForbidden, err.Error())
		webSocketClient.CloseWithReason(err.Error())
		return nil
	}

	//store the websocket connection in a map so we can get to it later for that employee id
	cache.AddConnection(byuID, webSocketClient)

	//store the employee in the cache and update it
	cache.AddEmployee(byuID)
	cache.UpdateEmployeeFromTimesheet(byuID, timesheet)

	//now launch some threads to go get all of the other information for the employee
	go cache.GetPossibleWorkOrders(byuID)
	go cache.GetPunchesForAllJobs(byuID)
	go cache.GetWorkOrderEntries(byuID)
	//go cache.GetOtherHours(byuID)

	//if offline, send an offline message down the web socket
	if isOffline {
		cache.SendMessageToClient(byuID, "offline-mode", true)
	} else {
		cache.SendMessageToClient(byuID, "offline-mode", false)
	}

	return nil
}
