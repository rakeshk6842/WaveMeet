#!/bin/bash

# WaveMeet iOS Deployment Quick Start Script
# Usage: ./deploy-ios.sh [simulator|device|testflight]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js not installed. Please install Node.js 16 or later."
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm not installed."
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    # Check Xcode
    if ! command -v xcode-select &> /dev/null; then
        print_error "Xcode not installed. Please install Xcode from App Store."
        exit 1
    fi
    print_success "Xcode found"
    
    # Check CocoaPods
    if ! command -v pod &> /dev/null; then
        print_warning "CocoaPods not installed. Installing..."
        sudo gem install cocoapods
    fi
    print_success "CocoaPods $(pod --version) found"
    
    # Check react-native CLI
    if ! command -v react-native &> /dev/null; then
        print_warning "React Native CLI not found. Installing..."
        npm install -g react-native-cli
    fi
    print_success "React Native CLI found"
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"
    
    # Navigate to iOS directory
    cd ios
    
    # Install npm dependencies
    print_warning "Installing npm dependencies..."
    npm install
    print_success "npm dependencies installed"
    
    # Install pod dependencies
    print_warning "Installing CocoaPods dependencies..."
    cd ios
    pod install --repo-update
    cd ../..
    print_success "CocoaPods dependencies installed"
    
    # Create .env file if doesn't exist
    if [ ! -f "ios/.env" ]; then
        print_warning "Creating .env file..."
        cat > ios/.env << 'EOF'
# Backend API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SOCKET_URL=http://localhost:3001

# App Configuration
REACT_APP_ENV=development
REACT_APP_DEBUG=true
EOF
        print_success ".env file created"
        print_warning "Please update .env with your backend URL if needed"
    fi
}

# Deploy to simulator
deploy_simulator() {
    print_header "Deploying to iOS Simulator"
    
    local simulator=${1:-"iPhone 15 Pro"}
    
    # Navigate to iOS directory
    cd ios
    
    # Start Metro bundler in background
    print_warning "Starting Metro bundler..."
    npm start &
    METRO_PID=$!
    sleep 5
    
    # Build and run on simulator
    print_warning "Building and deploying to simulator: $simulator..."
    npx react-native run-ios --simulator="$simulator"
    
    print_success "App deployed to simulator!"
    print_warning "Metro bundler running in background (PID: $METRO_PID)"
    print_warning "Press Ctrl+C to stop Metro bundler when done testing"
    
    wait $METRO_PID
}

# Deploy to physical device
deploy_device() {
    print_header "Deploying to Physical iOS Device"
    
    # Check device connection
    echo "Checking for connected iOS devices..."
    if ! xcrun simctl list devices | grep -i connected > /dev/null; then
        print_warning "No connected iOS devices found."
        print_warning "Please connect your iOS device and trust this computer."
        read -p "Press Enter when device is connected..."
    fi
    
    # Get Mac IP address
    MAC_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
    print_warning "Your Mac IP: $MAC_IP"
    print_warning "Make sure device is on same WiFi network"
    
    # Navigate to iOS directory
    cd ios
    
    # Update .env with Mac IP
    print_warning "Updating .env with Mac IP address..."
    cat > .env << EOF
REACT_APP_API_URL=http://$MAC_IP:3001
REACT_APP_SOCKET_URL=http://$MAC_IP:3001
REACT_APP_ENV=development
REACT_APP_DEBUG=true
EOF
    
    # Start Metro bundler
    print_warning "Starting Metro bundler..."
    npm start &
    METRO_PID=$!
    sleep 5
    
    # Build and run on device
    print_warning "Building and deploying to physical device..."
    npx react-native run-ios --device
    
    print_success "App deployed to physical device!"
    print_warning "Metro bundler running in background (PID: $METRO_PID)"
    print_warning "Press Ctrl+C to stop Metro bundler when done testing"
    
    wait $METRO_PID
}

# Build for TestFlight
build_testflight() {
    print_header "Building Release for TestFlight"
    
    cd ios/ios
    
    # Archive the app
    print_warning "Building archive (this may take several minutes)..."
    xcodebuild -workspace WaveMeet.xcworkspace \
        -scheme WaveMeet \
        -configuration Release \
        -archivePath /tmp/WaveMeet.xcarchive \
        archive
    
    print_success "Archive created successfully"
    
    # Export IPA
    print_warning "Exporting IPA for TestFlight..."
    xcodebuild -exportArchive \
        -archivePath /tmp/WaveMeet.xcarchive \
        -exportOptionsPlist ExportOptions.plist \
        -exportPath /tmp/WaveMeet-Export
    
    print_success "IPA exported to /tmp/WaveMeet-Export/"
    print_warning "Next steps:"
    echo "  1. Open App Store Connect (https://appstoreconnect.apple.com)"
    echo "  2. Go to TestFlight tab"
    echo "  3. Upload the IPA file"
    echo "  4. Add testers and send invitations"
}

# Clean build
clean_build() {
    print_header "Cleaning Build Artifacts"
    
    print_warning "Removing node_modules..."
    rm -rf ios/node_modules
    
    print_warning "Removing Pods..."
    rm -rf ios/ios/Pods
    rm -f ios/ios/Podfile.lock
    
    print_warning "Removing DerivedData..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    
    print_warning "Clearing npm cache..."
    npm cache clean --force
    
    print_success "Build artifacts cleaned"
}

# Show usage
show_usage() {
    cat << 'EOF'
WaveMeet iOS Deployment Script

Usage: ./deploy-ios.sh [command] [options]

Commands:
  setup               Setup development environment
  simulator           Deploy to iOS simulator (default)
  device              Deploy to physical iOS device
  testflight          Build for TestFlight beta distribution
  clean               Clean build artifacts
  help                Show this help message

Options:
  For simulator:
    --device="iPhone 15 Pro"   Specify simulator (default: iPhone 15 Pro)

Examples:
  ./deploy-ios.sh setup
  ./deploy-ios.sh simulator
  ./deploy-ios.sh simulator --device="iPhone 15"
  ./deploy-ios.sh device
  ./deploy-ios.sh testflight
  ./deploy-ios.sh clean

EOF
}

# Main script
main() {
    local command=${1:-"simulator"}
    
    case $command in
        setup)
            check_prerequisites
            setup_environment
            print_header "Setup Complete!"
            echo "Next step: Run './deploy-ios.sh simulator' to test on simulator"
            ;;
        simulator)
            local device=${2:-"iPhone 15 Pro"}
            if [[ $device == --device=* ]]; then
                device="${device#--device=}"
            fi
            check_prerequisites
            setup_environment
            deploy_simulator "$device"
            ;;
        device)
            check_prerequisites
            setup_environment
            deploy_device
            ;;
        testflight)
            check_prerequisites
            build_testflight
            ;;
        clean)
            clean_build
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
