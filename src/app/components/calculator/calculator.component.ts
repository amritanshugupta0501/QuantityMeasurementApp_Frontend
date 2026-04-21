import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementService, QuantityInputDTO } from '../../services/measurement.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  measurementService = inject(MeasurementService);

  measurementTypes = ['LengthUnit', 'VolumeUnit', 'WeightUnit', 'TemperatureUnit'];
  selectedType: string = 'LengthUnit';

  unitsMap: any = {
    'LengthUnit': ['INCH', 'FEET', 'YARD', 'CENTIMETRE'],
    'VolumeUnit': ['LITRE', 'MILLILITRE', 'GALLON'],
    'WeightUnit': ['KILOGRAM', 'GRAM', 'POUND'],
    'TemperatureUnit': ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
  };

  operations = ['Add', 'Subtract', 'Compare', 'Convert', 'Divide'];
  selectedOperation: string = 'Add';

  val1: number = 0;
  unit1: string = 'INCH';
  val2: number = 0;
  unit2: string = 'INCH';

  resultMessage: string | null = null;
  errorMessage: string | null = null;

  onTypeChange() {
    this.unit1 = this.unitsMap[this.selectedType][0];
    this.unit2 = this.unitsMap[this.selectedType][0];
    this.clearMessages();
  }

  isTwoInputsRequired(): boolean {
    return this.selectedOperation !== 'Convert';
  }

  clearMessages() {
    this.resultMessage = null;
    this.errorMessage = null;
  }

  calculate() {
    this.clearMessages();
    const payload: QuantityInputDTO = {
      thisQuantityDTO: { value: this.val1, unit: this.unit1, measurementType: this.selectedType },
      thatQuantityDTO: { value: this.val2, unit: this.unit2, measurementType: this.selectedType }
    };

    if (this.selectedOperation === 'Convert') {
      // In convert, we typically convert val1 in unit1 TO unit2. Backend might ignore val2.
      payload.thatQuantityDTO.value = 0;
    }

    const obs = (() => {
      switch (this.selectedOperation) {
        case 'Add': return this.measurementService.add(payload);
        case 'Subtract': return this.measurementService.subtract(payload);
        case 'Compare': return this.measurementService.compare(payload);
        case 'Convert': return this.measurementService.convert(payload);
        case 'Divide': return this.measurementService.divide(payload);
        default: return this.measurementService.add(payload);
      }
    })();

    obs.subscribe({
      next: (res: any) => {
        if (res && res.message) {
          this.resultMessage = res.message;
        } else {
          this.resultMessage = JSON.stringify(res);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error?.error || 'An error occurred during calculation.';
      }
    });
  }
}
