const fs = require('fs');

// Function to convert a string in any base to decimal
function convertToDecimal(value, base) {
    base = BigInt(base);
    let result = BigInt(0);
    
    for (let i = 0; i < value.length; i++) {
        let char = value[i].toLowerCase();
        let digit;
        
        if (char >= '0' && char <= '9') {
            digit = BigInt(parseInt(char));
        } else {
            digit = BigInt(char.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        }
        
        result = result * base + digit;
    }
    
    return result;
}

// Lagrange interpolation using BigInt for large numbers
function lagrangeInterpolation(x, y, xValue) {
    let result = BigInt(0);
    const n = x.length;
    
    for (let i = 0; i < n; i++) {
        let term = y[i];
        let numerator = BigInt(1);
        let denominator = BigInt(1);
        
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                numerator = numerator * (xValue - x[j]);
                denominator = denominator * (x[i] - x[j]);
            }
        }
        
        let contribution = term * numerator / denominator;
        result = result + contribution;
    }
    
    return result;
}

// Process the test case from a file
function processTestCase(filename) {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    const n = data.keys.n;
    const k = data.keys.k;
    
    console.log(Processing test case with n=${n}, k=${k});
    
    // Extract and decode points
    const xValues = [];
    const yValues = [];
    
    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const x = BigInt(i);
            const base = parseInt(data[i].base);
            const encodedY = data[i].value;
            const y = convertToDecimal(encodedY, base);
            
            console.log(Point ${i}: x=${x}, y=${y} (decoded from base ${base}));
            
            xValues.push(x);
            yValues.push(y);
        }
    }
    
    // Use k points for interpolation (threshold)
    const kXValues = xValues.slice(0, k);
    const kYValues = yValues.slice(0, k);
    
    // Find C by evaluating at x = 0
    const secretC = lagrangeInterpolation(kXValues, kYValues, BigInt(0));
    
    // Verify with all points as a sanity check
    const allSecretC = lagrangeInterpolation(xValues, yValues, BigInt(0));
    
    console.log("Secret C (using only " + k + " points): " + secretC.toString());
    console.log("Secret C (using all " + n + " points): " + allSecretC.toString());
    
    return secretC.toString();
}

// Execute with command line argument or default filename
const filename = process.argv[2] || 'testcase.json';
try {
    const secretC = processTestCase(filename);
    console.log(\nFinal result - The secret value C is: ${secretC});
} catch (error) {
    console.error(Error: ${error.message});
}