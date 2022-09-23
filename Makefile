build:
	npm install

run:
	./dragonstd

test:
	./translator --tokens test.tokens --executable executable.js
	node ./executable.js

clean:
	rm ./lexer ./test.tokens