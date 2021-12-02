
start-db:
	docker run -it -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14-alpine
