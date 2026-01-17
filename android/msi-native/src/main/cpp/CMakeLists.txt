cmake_minimum_required(VERSION 3.22.1)

project("msi_native")

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add the native library
add_library(${CMAKE_PROJECT_NAME} SHARED
    native_state.cpp
)

# Find required libraries
find_library(log-lib log)

# Link libraries
target_link_libraries(${CMAKE_PROJECT_NAME}
    ${log-lib}
)

# Compiler flags for optimization
target_compile_options(${CMAKE_PROJECT_NAME} PRIVATE
    -Wall
    -Wextra
    -O2
)
