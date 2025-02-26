# IPO tracker Node

Pull IPO allotment status from 4 registrars MAASHITLA, BIGSHARE, LINKINTIME, and CAMEO for all you pans.

## Tools

Node, MongoDB, Express

## How to start

Make sure you have Node on your machine then **clone repo** then run `npm i` to install all deps
the to start `npm run start`

## APIs

- POST /register
- POST /login
- GET, POST, DELETE /pan
- GET checkAllotmentStatus

### TODO

- [ ] try every case for caching layer
- [ ] add logger
- [ ] company removal logic from scrapper
