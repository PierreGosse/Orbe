#!/bin/sh
curl -d '{ "login":"toto", "text":"toto est bo" }' -H "Content-Type: application/json" -X POST http://localhost:3210/login