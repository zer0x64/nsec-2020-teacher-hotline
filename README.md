# NSEC 2020: Teacher's Hotline
This challenge was presented at NorthSec 2020. The participants were required to gain access to a teacher's account via a client side exploit.

# Credits (contains spoiler for the challenge)
A big part of the projet is the [RustPython project](https://github.com/RustPython/RustPython), which is used to run a Python interpreter in a WebAssembly module.
Here it is not imported elegantly, especially since some backdoor code has been inserted during the build process for the sake of simplifying exploitation.
