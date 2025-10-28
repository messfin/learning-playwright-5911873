#!/usr/bin/env python3
"""
Test runner script for FusionWW Python tests
"""
import subprocess
import sys
import os


def run_command(command):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Return code: {e.returncode}")
        print(f"Error output: {e.stderr}")
        return False


def main():
    """Main function to run tests"""
    print("FusionWW Python Test Runner")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("Error: requirements.txt not found. Please run this script from the fuspy directory.")
        sys.exit(1)
    
    # Install dependencies if needed
    print("Checking dependencies...")
    if not run_command("pip install -r requirements.txt"):
        print("Failed to install dependencies")
        sys.exit(1)
    
    # Install Playwright browsers if needed
    print("Installing Playwright browsers...")
    if not run_command("playwright install"):
        print("Failed to install Playwright browsers")
        sys.exit(1)
    
    # Run tests
    print("\nRunning tests...")
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
        if not os.path.exists(test_file):
            print(f"Test file {test_file} not found")
            sys.exit(1)
        command = f"pytest {test_file} -v"
    else:
        command = "pytest -v"
    
    if not run_command(command):
        print("Tests failed")
        sys.exit(1)
    
    print("All tests completed successfully!")


if __name__ == "__main__":
    main()


