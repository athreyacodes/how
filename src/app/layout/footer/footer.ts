import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="site-footer">
      <p class="credit">© {{ year }} Athreya M R</p>
      <a class="home-link" href="https://athreya.codes/">athreya.codes</a>
    </footer>
  `,
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}
