# Start from the official Golang base image
FROM golang:1.16

# Set the current working directory inside the container
WORKDIR /backend

# Copy go mod and sum files to the workspace
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the application
RUN go build -o main .

# Expose port 9999 to the outside world
EXPOSE 9999

# Run the executable
CMD ["./main"]