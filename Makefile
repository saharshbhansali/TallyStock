build:
	@go build main.go -o build/TallyStock

autobuild: resumedb
	air

autorebuild: resetdb
	air

run: build resetdb
	@./build/TallyStock
	
clean:
	@docker ps | grep postgres && docker container stop postgres && docker container rm postgres && echo "running container stopped" || echo "no running container"
	
resumedb:
	@docker ps | grep postgres && echo "container already running" && true || echo "running new container: $$(docker run --name postgres -e POSTGRES_PASSWORD=TallyStock -p 5432:5432 -d postgres)"
	@sleep 5s

resetdb: clean
	@docker run --name postgres -e POSTGRES_PASSWORD=TallyStock -p 5432:5432 -d postgres && echo "running new container"
	@sleep 5s

rerun: build resumedb
	@./build/TallyStock