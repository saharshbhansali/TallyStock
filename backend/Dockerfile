# Start from the official Golang base image
FROM golang:1.21.2

# Set the current working directory inside the container
WORKDIR /backend

# Copy go mod and sum files to the workspace
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Install realize and air
# RUN go get github.com/oxequa/realize
RUN go install github.com/cosmtrek/air@latest

# Add the location of go binaries to PATH
# ENV PATH="/root/go/bin:${PATH}"

# Copy the source code into the container
COPY . .

# Build the application
# RUN go build -o main .

# Expose port 9999 to the outside world
EXPOSE 9999

# Run the executable
# CMD ["./main"]