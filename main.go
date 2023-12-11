package main

import (
	"database/sql"
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/k-nox/ddb-backend-developer-challenge/graph"
	"github.com/k-nox/ddb-backend-developer-challenge/graph/generated"
	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
	"log"
	"net/http"
	"os"
)

const defaultPort = "8080"

func main() {
	migrations := &migrate.FileMigrationSource{
		Dir: "db/migrations",
	}

	// start up database connection
	db, err := sql.Open("sqlite3", "db/data.db")
	if err != nil {
		log.Fatalf("error opening sqlite3: %s\n", err.Error())
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Fatalf("db could not be closed: %s\n", err.Error())
		}
	}(db)

	// apply any new migrations
	n, err := migrate.Exec(db, "sqlite3", migrations, migrate.Up)
	if err != nil {
		log.Fatalf("error applying migrations: %s", err.Error())
	}
	log.Printf("Applied %d migrations!\n", n)

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
	http.Handle("/", playground.Handler("GraphQL Playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL Playground", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
