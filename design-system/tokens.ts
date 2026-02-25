// OmnifiCX Design System Tokens
export const tokens = {
  color: {
    bg:            '#F1F3F5',  // page background (gray-100)
    surface:       '#FFFFFF',  // cards, sidebar, inputs
    border:        '#DEE2E6',  // card borders, dividers (gray-200)
    borderDefault: '#CED4DA',  // input borders (gray-300)
    borderHover:   '#ADB5BD',  // input hover (gray-400)
    divider:       '#DEE2E6',
    text:          '#212529',  // headings, values (gray-900)
    textSecondary: '#495057',  // labels, body (gray-600)
    textMuted:     '#868E96',  // secondary text (gray-500)
    textDisabled:  '#ADB5BD',  // placeholders (gray-400)
    primary:       '#2B4FFF',  // buttons, active nav, focus rings
    primaryHover:  '#1A3FE0',  // button hover
    primaryTint:   '#EEF1FF',  // active nav bg, subtle tints
    primaryText:   '#FFFFFF',
    secondary:     '#7C3AED',
    success:       '#10B981',  // emerald-500
    warning:       '#F59E0B',  // amber-500
    error:         '#EF4444',  // red-500
    info:          '#3B82F6',  // sky-500
    placeholder:   '#D1D5DB',
  },
  space: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  40,
    xxl: 64,
  },
  radius: {
    sm:   6,
    md:   8,
    lg:   12,
    xl:   16,
    full: 9999,
  },
  font: {
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    size: {
      xs:    11,    // helper text
      sm:    12,    // badge
      label: 11.5,  // form label
      md:    12.5,  // input / body
      base:  13.5,  // section title
      lg:    15,    // modal title
      xl:    18,    // page title
      xxl:   24,
      xxxl:  32,
    },
    weight: {
      normal:   400,
      medium:   500,
      semibold: 600,
      bold:     700,
    },
    lineHeight: {
      tight:  1.2,
      normal: 1.5,
      loose:  1.8,
    },
  },
  shadow: {
    sm:    '0 1px 3px rgba(0,0,0,0.06)',
    md:    '0 2px 8px rgba(0,0,0,0.08)',
    lg:    '0 4px 16px rgba(0,0,0,0.10)',
    modal: '0 25px 50px rgba(0,0,0,0.25)',
  },
  transition: 'all 0.15s ease',
}
