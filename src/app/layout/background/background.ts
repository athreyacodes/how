import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="wave3-container">
      <div class="wave3-sea"></div>
      <div class="wave3-sky blur slow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `
})
export class Background {}
