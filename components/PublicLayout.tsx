'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight, User, Facebook, Linkedin, Instagram } from 'lucide-react';

export function AwLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div style={{ width: 28, height: 22, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%, 85% 100%, 50% 30%, 15% 100%)',
            background: '#FFE81A',
          }}
        />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span
          style={{
            color: inverted ? 'white' : '#0F3A7A',
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '-0.01em',
          }}
        >
          ACTIEF
        </span>
        <span
          style={{
            color: inverted ? 'white' : '#0F3A7A',
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '-0.01em',
          }}
        >
          WERKT!
        </span>
      </div>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header style={{ background: '#0F3A7A', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/">
          <AwLogo inverted />
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="text-sm font-bold px-4 py-2 flex items-center gap-1.5"
            style={{ background: 'white', color: '#0F3A7A', borderRadius: '4px' }}
          >
            <User className="w-4 h-4" /> Inloggen
          </button>
          <button
            className="text-sm font-bold px-4 py-2"
            style={{ background: '#FFE81A', color: '#0F3A7A', borderRadius: '4px' }}
          >
            Inschrijven
          </button>
        </div>
      </div>
    </header>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-black text-sm mb-4 text-white">{title}</h4>
      <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
            <ChevronRight className="w-3 h-3" style={{ color: '#FFE81A' }} strokeWidth={3} /> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <div
      className="w-8 h-8 rounded flex items-center justify-center cursor-pointer hover:opacity-80"
      style={{ background: 'rgba(255,255,255,0.1)' }}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer style={{ background: '#0A2955', color: 'white' }} className="pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <FooterCol
            title="Voor werkzoekenden"
            items={['Vacatures', 'Zzp opdrachten', 'Inschrijven', 'Opleidingen', 'Veelgestelde vragen']}
          />
          <FooterCol
            title="Voor werkgevers"
            items={['Vacature plaatsen', 'Plan een adviesgesprek', 'Onze diensten', 'Kwaliteit', 'Inloggen Mijn Actief']}
          />
          <FooterCol
            title="Over Actief Werkt"
            items={['Contact', 'Blog', 'Onze cultuur', 'Suggestie of klacht', 'Werken bij Actief Werkt!']}
          />
          <div>
            <h4 className="font-black text-sm mb-4 text-white">Volg ons</h4>
            <div className="flex gap-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Instagram} />
            </div>
          </div>
        </div>
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 32, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: 'polygon(0 100%, 50% 0, 100% 100%, 85% 100%, 50% 30%, 15% 100%)',
                  background: '#FFE81A',
                }}
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>ACTIEF</span>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>WERKT!</span>
            </div>
          </div>
        </div>
        <div
          className="mt-8 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs"
          style={{ color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span>Algemene voorwaarden</span>
          <span>Certificering</span>
          <span>Cookies</span>
          <span>Disclaimer</span>
          <span>Privacy statement</span>
          <span>Voorwaarden van inschrijving</span>
        </div>
      </div>
    </footer>
  );
}