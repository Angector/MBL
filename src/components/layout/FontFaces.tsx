import { withBasePath } from '@/lib/utils/base-path';

/** Nian weights -> file names inside public/fonts. Edit here if your files are named differently. */
const nianFiles: { weight: number; file: string }[] = [
  { weight: 100, file: 'w_Nian Thin.ttf' },
  { weight: 200, file: 'w_Nian ExtraLight.ttf' },
  { weight: 300, file: 'w_Nian Light.ttf' },
  { weight: 400, file: 'w_Nian.ttf' },
  { weight: 600, file: 'w_Nian SemiBold.ttf' },
  { weight: 700, file: 'w_Nian Bold.ttf' },
  { weight: 800, file: 'w_Nian ExtraBold.ttf' },
  { weight: 900, file: 'w_Nian Black.ttf' },
];

/** CSS url() is not rewritten by Next, so the @font-face rules are emitted here with the base path applied. */
export function FontFaces() {
  const css = nianFiles
    .map(({ weight, file }) => `@font-face{font-family:'Nian';font-style:normal;font-weight:${weight};font-display:swap;src:url('${withBasePath(`/fonts/${encodeURIComponent(file)}`)}') format('truetype')}`)
    .join('');
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
