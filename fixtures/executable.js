const stack = [];
{ // 1 would be replaced by lookahead lexeme
  stack.push(1); }
{ // 1 would be replaced by lookahead lexeme
  stack.push(1); }
{ // 4 would be replaced by lookahead lexeme
  stack.push(4); }
{ stack.push(stack.pop() + stack.pop()); }
{ const right = stack.pop();
  stack.push(stack.pop() / right); }
{ console.log(`Calculation: ${stack.pop()}`); }