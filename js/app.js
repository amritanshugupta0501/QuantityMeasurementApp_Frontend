const unitDictionary = {
    "LengthUnit": ["INCH", "FEET", "YARD", "CENTIMETRE"],
    "VolumeUnit": ["GALLON", "LITRE", "MILLILITRE"],
    "WeightUnit": ["KILOGRAM", "GRAM", "TONNE"],
    "TemperatureUnit": ["CELSIUS", "FAHRENHEIT"]
};
function updateUnits() {
    const selectedType = document.getElementById('measurement-type').value;
    const availableUnits = unitDictionary[selectedType];
    
    const unit1 = document.getElementById('unit1');
    const unit2 = document.getElementById('unit2');
    
    unit1.innerHTML = '';
    unit2.innerHTML = '';
    
    availableUnits.forEach(unit => {
        unit1.innerHTML += `<option value="${unit}">${unit}</option>`;
        unit2.innerHTML += `<option value="${unit}">${unit}</option>`;
    });

    if(availableUnits.length > 1) {
        unit2.selectedIndex = 1; 
    }
}
function toggleOperationUI() {
    const op = document.getElementById('operation-type').value;
    const val2 = document.getElementById('val2');
    const actionLabel = document.getElementById('action-label');

    if (op === 'convert') {
        val2.classList.add('hidden');
        actionLabel.innerText = "TO";
    } else if (op === 'add') {
        val2.classList.remove('hidden');
        actionLabel.innerText = "+";
    } else if (op === 'compare') {
        val2.classList.remove('hidden');
        actionLabel.innerText = "COMPARE";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('measurement-type')) {
        updateUnits();
        toggleOperationUI();
    }
});
async function performCalculation() {
    const type = document.getElementById('measurement-type').value;
    const operation = document.getElementById('operation-type').value; 
    
    const val1 = document.getElementById('val1').value;
    const unit1 = document.getElementById('unit1').value;
    const val2 = document.getElementById('val2').value || 0;
    const unit2 = document.getElementById('unit2').value;
    
    const resultBox = document.getElementById('calc-result');

    if(!val1 || (operation !== 'convert' && !val2)) {
        alert("Please fill in all value fields.");
        return;
    }

    const payload = {
        thisQuantityDTO: {
            value: parseFloat(val1),
            unit: unit1,
            measurementType: type 
        },
        thatQuantityDTO: {
            value: parseFloat(val2), 
            unit: unit2,
            measurementType: type 
        }
    };

    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${CONFIG.API_BASE_URL}/quantities/${operation}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            resultBox.classList.remove('hidden');
            if(operation === 'convert') {
                resultBox.innerHTML = `${val1} ${unit1} = <span class="success">${data.resultValue} ${data.resultUnit}</span>`;
            } else if (operation === 'add') {
                resultBox.innerHTML = `${val1} ${unit1} + ${val2} ${unit2} = <span class="success">${data.resultValue} ${data.resultUnit}</span>`;
            } else if (operation === 'compare') {
                const symbol = data.isEqual ? "==" : "!=";
                const color = data.isEqual ? "success" : "error";
                resultBox.innerHTML = `${val1} ${unit1} <span class="${color}">${symbol}</span> ${val2} ${unit2}`;
            }
            
        } else if (response.status === 401) {
            logout(); 
            alert("Your session expired. Please login again.");
        } else {
            alert("Error: " + (data.error || JSON.stringify(data)));
        }
    } catch (error) {
        alert("Failed to connect to the server.");
    }
}