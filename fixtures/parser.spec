Calculator ::= A #0
A ::= A + B #1
A ::= A - B #2
A ::= B
B ::= B * C #3
B ::= B / C #4
B ::= C
C ::= ( A )
C ::= #5 NUMBER
%%
const stack = [];
%%
#0 { console.log(`Calculation: ${stack.pop()}`); }
#1 { stack.push(stack.pop() + stack.pop()); }
#2 {
  const right = stack.pop();
  stack.push(stack.pop() - right);
}
#3 { stack.push(stack.pop() * stack.pop()); }
#4 {
  const right = stack.pop();
  stack.push(stack.pop() / right);
}
#5 {
  // $# would be replaced by lookahead lexeme
  stack.push($#);
}
