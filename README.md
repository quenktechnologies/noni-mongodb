# Safe MongoDB

This module provides typesafe functions for utilising the mongodb driver.

It avoids adding too much to the functions mongodb exports, mostly simplifying
arguments and wrapping results in the data and monad primitives of 
[@quenk/noni](https://github.com/quenktechnologies/noni).

Only functions we actually use at QT are included here, in the future
the whole driver may be supported but that is not a goal for now.

# License
Apache-2.0 (C) 2019 Quenk Technologies Limited
