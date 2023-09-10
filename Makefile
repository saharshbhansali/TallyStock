build:
	@go build -o bin/bookstore

run: build
	@$(docker ps | grep postgres && docker container stop postgres && docker container rm postgres || true)
	@docker run --name postgres -e POSTGRES_PASSWORD=bookstore -p 5432:5432 -d postgres
	@sleep 5s
	@./bin/bookstore

clean:
	@$(docker ps | grep postgres && docker container stop postgres && docker container rm postgres || true)

reset: build
	@$(docker ps | grep postgres && docker container stop postgres && docker container rm postgres || true)
	@docker run --name postgres -e POSTGRES_PASSWORD=TallyStock -p 5432:5432 -d postgres
	air
