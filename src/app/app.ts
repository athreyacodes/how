import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SeoService } from './core/seo';
import { Background } from './layout/background/background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Background],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  constructor() {
    inject(SeoService).apply();
  }
}
