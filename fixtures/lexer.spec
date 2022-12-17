      \d+ NUMBER true
      \+ + false
      - - false
      \* * false
      / / false
      \( ( false
      \) ) false
      [\s\n] (SKIP)
      . (ERR) "bad input"
