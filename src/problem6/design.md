** System Design for Transaction Broadcast Service **

# High Level Design

-   View Flowchart.pdf for diagram

## Components

API Gateway (Nginx) -> Dispatching of requests to the approriate internal services.
Transaction Processing Service -> Validates, signs data and outputs signed transaction. Stores to DB. Pushes transaction to RabbitMQ.
Message Queue (RabbitMQ) -> Provides durability (able to persist the messages). Provides delivery acknowledgement.
Transaction Broadcast Service -> Consumes from message queue and broadcast signed transaction to EVM network.
PostgreSQL -> Responsible for storing signed transaction and its status.
Admin Interface -> Reflects list of transactions that have passed or failed. Able to retry failed broadcast.

## Flow

-   The API Gateway receives a POST request on /broadcast_transaction from an internal service.
-   The request is forwarded to the Transaction Processing Service.
-   The Transaction Processing Service validates and signs the transaction data, producing a signed transaction.
-   The signed transaction is saved to PostgreSQL with the status "PENDING" and then pushed into RabbitMQ message queue.
-   The Transaction Broadcast Service then consumes the signed transaction from RabbitMQ queue.
-   Attempts to broadcast the transaction via an RPC request to the EVM-compatible blockchain network.
-   On successful broadcast, the transaction status in PostgreSQL is updated to "SUCCESS".
-   If broadcasting fails, a retry mechanism is employed.
-   An admin interface allows administrators to manually retry failed transactions.
-   A cron job can be run to retry failed transactions as well

# Component Details

## API Gateway (Nginx)

-   This gateway receives POST request /broadcast_transaction with the payload of message_type and data from client.
-   The gateway sends a POST request to the Transaction Broadcast Service with the payload of message_type and data
-   Upon success (200), the gateway returns HTTP 200.

## Transaction Processing Service

-   Validates, signs the data and output signed transaction.
-   Creates transaction object and pushes into the RabbitMQ message queue
-   Stores this signed transaction and status "PENDING" into postgreSQL
-   Returns HTTP 200.

## Transaction Broadcasting Service (TODO scaling with multiple nodes)

-   Consumes from RabbitMQ message queue, retrieving signed transaction.
-   Timer of 1 minute begins.
-   Makes RPC request to blockchain node
-   Upon receiving success code, acknowledge the message in order to remove the message from the RabbitMQ messsage queue
-   Update the status of the signed transaction from "PENDING" to "SUCCESS" in postgreSQL

-   In the event of a failed request to blockchain node / timeout
-   Requeue the message. There will be a maximum retry count.
    -   If exceeded, send the message to the Dead Letter Exchange where the admin can retry them or have a cron job to retry them
        -   update status of signed transaction from "PENDING" to "FAILED" in postgreSQL

# Scaling up

# API Gateway

-   Nginx is able to handle large volumes of requests/connections.
-   Routes the requests to multiple instances of Transaction Processing Service.

## Transaction Processing Service

-   Horizontal Scaling by adding more instances of the service. (Usage of Kubernetes for autoscaling)

## Transaction Broadcasting Service

-   Horizontal scaling by adding more instances of the service. (Usage of Kubernetes for autoscaling)
-   Each instance will continue to consume from the RabbitMQ message queue
-   RabbitMQ ensures that the messages are distributed evenly between the instances (default Round Robbin)

## PostgreSQL

-   To scale for reads, we can use horizontal partioning where split the transaction table via its row
-   To scale for writes, we can employ sharding and have the different partitions of the table in different machines
    -   A concern for this could be the overhead caused by network latency due to the database being distributed
