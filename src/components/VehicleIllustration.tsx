type Vehicle = {
  body: string
  windows: string[]
  wheels: number[]
  color: string
  trim: string
  roof?: string
}

const vehicles: Record<number, Vehicle> = {
  5: {
    body: 'M12 77 20 59 49 52 69 30 Q77 24 94 24 H140 Q158 24 170 39 L189 52 204 58 211 77 207 86 H14 Z',
    windows: ['M54 52 73 32 Q78 29 94 29 H107 V52 Z', 'M113 29 H140 Q153 29 164 43 L174 52 H113 Z'],
    wheels: [51, 174], color: '#168bdb', trim: '#13c4d0',
  },
  6: {
    body: 'M12 79 20 52 39 45 60 25 Q65 20 78 20 H157 Q171 20 179 39 L201 49 210 61 211 83 205 88 H15 Z',
    windows: ['M44 45 64 28 Q68 25 81 25 H111 V47 H44 Z', 'M117 25 H154 Q166 25 172 40 L179 48 H117 Z'],
    wheels: [51, 174], color: '#d74c6c', trim: '#f6bb2c',
    roof: 'M69 18 H150',
  },
  7: {
    body: 'M11 81 17 36 Q18 25 31 25 H151 Q163 25 171 38 L196 52 208 65 210 84 204 89 H14 Z',
    windows: ['M29 33 H65 V54 H25 Z', 'M71 33 H107 V54 H71 Z', 'M113 33 H150 Q156 33 160 41 L170 54 H113 Z', 'M176 57 190 58 198 70 H176 Z'],
    wheels: [51, 174], color: '#05bfc2', trim: '#ffbe29',
    roof: 'M53 21 H145',
  },
  8: {
    body: 'M10 81 15 34 Q16 22 31 22 H164 Q174 22 180 34 L203 56 211 68 211 86 H10 Z',
    windows: ['M26 30 H55 V54 H23 Z', 'M61 30 H90 V54 H61 Z', 'M96 30 H125 V54 H96 Z', 'M131 30 H159 Q168 30 173 45 L178 54 H131 Z'],
    wheels: [51, 177], color: '#f0a51c', trim: '#04bfc1',
    roof: 'M37 19 H153',
  },
  9: {
    body: 'M9 82 13 32 Q14 18 30 18 H165 Q178 18 184 34 L207 57 212 70 V87 H9 Z',
    windows: ['M24 28 H52 V53 H22 Z', 'M58 28 H87 V53 H58 Z', 'M93 28 H122 V53 H93 Z', 'M128 28 H159 Q169 28 175 47 L179 53 H128 Z'],
    wheels: [50, 180], color: '#4b72c5', trim: '#ffc632',
    roof: 'M46 15 H158',
  },
  10: {
    body: 'M10 82 V30 Q10 16 25 16 H192 Q207 16 209 33 V85 Q208 90 200 90 H19 Q10 89 10 82 Z',
    windows: ['M21 28 H52 V55 H21 Z', 'M58 28 H89 V55 H58 Z', 'M95 28 H126 V55 H95 Z', 'M132 28 H163 V55 H132 Z', 'M169 28 H197 V55 H169 Z'],
    wheels: [50, 176], color: '#e74769', trim: '#ffbf2d',
    roof: 'M51 12 H86 M128 12 H162',
  },
}

function Bicycle() {
  return <g stroke="#4c5355" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="52" cy="78" r="21" fill="#e5fbf8" stroke="#00aeb3" strokeWidth="4"/>
    <circle cx="166" cy="78" r="21" fill="#e5fbf8" stroke="#00aeb3" strokeWidth="4"/>
    <path d="M52 78 86 37 114 78 52 78 92 58 114 78 143 36 166 78" fill="none" stroke="#d99b18" strokeWidth="4"/>
    <path d="M79 37h21m40-2 10-7h13m-25 7-3-10h-12" fill="none"/>
    <path d="M107 76h14m-8 2-5 8" fill="none" stroke="#11aeb1"/>
    <path d="M67 32h17" stroke="#d44166" strokeWidth="5"/>
  </g>
}

function Scooter() {
  return <g stroke="#55585b" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round">
    <circle cx="57" cy="81" r="17" fill="#29bfbd" stroke="#323637" strokeWidth="4"/>
    <circle cx="166" cy="81" r="17" fill="#29bfbd" stroke="#323637" strokeWidth="4"/>
    <circle cx="57" cy="81" r="6" fill="#ffcb24"/><circle cx="166" cy="81" r="6" fill="#ffcb24"/>
    <path d="M38 68 Q47 53 70 56 L92 53 118 76 H153 L139 39 Q144 31 154 32 L174 70 166 78 H109 Q96 77 82 65 L59 65 Z" fill="#ffc627"/>
    <path d="M96 48 Q113 39 134 44 L139 53 H94 Z" fill="#f6b51c"/>
    <path d="M148 34 143 18h-15m14 0 7-4m-4 37-26 23" fill="none"/>
    <path d="M96 82h33" stroke="#a8aaad" strokeWidth="4"/>
    <path d="M61 54h31" stroke="#e15b73" strokeWidth="4"/>
  </g>
}

function AutoRickshaw() {
  return <g stroke="#454a4e" strokeWidth="2.2" strokeLinejoin="round">
    <path d="M34 78 V36 Q35 23 49 23 H137 Q149 23 155 35 L170 56 190 67 V83 H32 Z" fill="#ffbd22"/>
    <path d="M44 37 Q45 31 53 31 H130 V62 H44 Z" fill="#f3f7f2"/>
    <path d="M137 31 Q146 33 150 42 L161 58 H137 Z" fill="#afdbdf"/>
    <path d="M45 61 H129 V81 H43 Z" fill="#292c2e"/>
    <path d="M77 61 V81m53-50v50" stroke="#303437"/>
    <path d="M54 26h70" stroke="#f8a50a" strokeWidth="6"/>
    <circle cx="58" cy="83" r="12" fill="#3c4142"/><circle cx="167" cy="83" r="12" fill="#3c4142"/>
    <circle cx="58" cy="83" r="5" fill="#ffcb2c"/><circle cx="167" cy="83" r="5" fill="#ffcb2c"/>
    <path d="M187 65h9" stroke="#ffca31" strokeWidth="3"/>
  </g>
}

function FourWheeler({vehicle}: {vehicle: Vehicle}) {
  return <g stroke="#474d53" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
    <path d={vehicle.body} fill={vehicle.color}/>
    <path d={vehicle.roof} fill="none" stroke={vehicle.trim} strokeWidth="4"/>
    {vehicle.windows.map((window, i) => <path key={i} d={window} fill="#c9e9f3" stroke="#657078" strokeWidth="1.6"/>)}
    <path d="M19 67 H204" stroke={vehicle.trim} strokeWidth="3.5"/>
    <path d="M111 56 V82" stroke="#40545a" strokeWidth="1.4"/>
    <path d="M12 70h9m182 0h8" stroke="#ffca36" strokeWidth="4"/>
    {vehicle.wheels.map(x => <g key={x}><circle cx={x} cy="85" r="15" fill="#32383b"/><circle cx={x} cy="85" r="8" fill="#d3dadb"/><circle cx={x} cy="85" r="4" fill={vehicle.trim}/></g>)}
  </g>
}

export function VehicleIllustration({count}: {count: number}) {
  if (count === 4) return <img src="./seat-car.svg" alt="" />
  return <svg viewBox="0 0 220 110" aria-hidden="true" focusable="false">
    <ellipse cx="110" cy="104" rx="95" ry="3" fill="#29343b" opacity=".12"/>
    {count === 1 ? <Bicycle/> : count === 2 ? <Scooter/> : count === 3 ? <AutoRickshaw/> : <FourWheeler vehicle={vehicles[count]}/>}
  </svg>
}
