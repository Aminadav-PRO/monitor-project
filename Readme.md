# Monitor Project

![modes](https://github.com/user-attachments/assets/42f32aa0-3db8-4960-9fd8-2a298de77bc5)

## Overview

The Monitor Project is a web-based application that helps users display and record flight instrumentation data, including Altitude, Horizontal Situation Indicator (HSI), and Attitude Direction Indicator (ADI). The collected data is stored in a MongoDB database for further analysis.

## Config
Each folder (Frontend, Backend) contains config files with configurable constant variables.

* In the Frontend, the config file is located in the src folder.
* In the Backend, the config file is in the root directory.

To access the client from another device, make sure to change the server IP in the frontend config file to the actual server's IP address instead of using "localhost." This will prevent the user from being redirected to their own device.

## Running
### Frontend
1. Navigate to the client directory `backend`
2. Run `npm install`
3. Run `npm start`

### Backend
1. Navigate to the client directory `frontend`
2. Run `npm install`
3. Run `npm start`
4. Navigate to `http://localhost:3000/`
