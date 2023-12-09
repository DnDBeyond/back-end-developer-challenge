package main

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
	"log"
)

func main() {
	migrations := &migrate.FileMigrationSource{
		Dir: "db/migrations",
	}

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

	n, err := migrate.Exec(db, "sqlite3", migrations, migrate.Up)
	if err != nil {
		log.Fatalf("error applying migrations: %s", err.Error())
	}
	fmt.Printf("Applied %d migrations!\n", n)
}
