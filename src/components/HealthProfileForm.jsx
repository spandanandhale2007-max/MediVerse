import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ShieldCheck, ClipboardList } from 'lucide-react'
import {
  bloodGroups,
  genders,
  chronicConditions,
  surgicalHistory,
  drugAllergies,
  otherAllergies,
  medicationClasses,
  familyHistory,
  lifestyleFields,
  pregnancyOptions,
} from '../data/medicalHistory'

const STEPS = ['Basics', 'Conditions', 'Surgeries & allergies', 'Medications & family', 'Lifestyle']

const EMPTY = {
  age: '',
  gender: '',
  weight: '',
  height: '',
  bloodGroup: '',
  conditions: [],
  conditionsOther: '',
  surgeries: [],
  surgeriesNote: '',
  drugAllergies: [],
  otherAllergies: [],
  allergiesNote: '',
  medications: [],
  medicationsOther: '',
  familyHistory: [],
  lifestyle: {},
  pregnancy: '',
}

export default function HealthProfileForm({ initial, defaultAge, onSave, onCancel }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    age: initial?.age ?? defaultAge ?? '',
    lifestyle: initial?.lifestyle ?? {},
  }))

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggle(key, value) {
    setForm((f) => {
      const list = f[key] ?? []
      return { ...f, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] }
    })
  }

  function setLifestyle(key, value) {
    setForm((f) => ({ ...f, lifestyle: { ...f.lifestyle, [key]: value } }))
  }

  const isLast = step === STEPS.length - 1

  function next() {
    if (isLast) {
      onSave(form)
      return
    }
    setStep((s) => s + 1)
  }

  const showPregnancy = form.gender === 'Female'

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
      <div
        className="mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm"
        style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
      >
        <ShieldCheck size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
        <p>
          This helps us flag interactions and tailor your reminders. Everything stays on this device — it isn't
          uploaded anywhere. Skip anything you'd rather not share.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {STEPS[step]}
          </span>
          <span className="tabular-nums">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="meter-track h-1.5">
          <div
            className="meter-fill"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'var(--brand)' }}
          />
        </div>
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age">
                <TextInput
                  value={form.age}
                  onChange={(v) => set('age', v.replace(/\D/g, '').slice(0, 3))}
                  placeholder="e.g. 34"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Blood group">
                <Select value={form.bloodGroup} onChange={(v) => set('bloodGroup', v)} options={bloodGroups} placeholder="Select" />
              </Field>
              <Field label="Weight (kg)">
                <TextInput
                  value={form.weight}
                  onChange={(v) => set('weight', v.replace(/[^\d.]/g, '').slice(0, 5))}
                  placeholder="e.g. 68"
                  inputMode="decimal"
                />
              </Field>
              <Field label="Height (cm)">
                <TextInput
                  value={form.height}
                  onChange={(v) => set('height', v.replace(/[^\d.]/g, '').slice(0, 5))}
                  placeholder="e.g. 170"
                  inputMode="decimal"
                />
              </Field>
            </div>
            <Field label="Gender">
              <ChipGroup options={genders} selected={form.gender ? [form.gender] : []} onToggle={(v) => set('gender', v)} />
            </Field>
            {showPregnancy && (
              <Field label="Pregnancy status">
                <ChipGroup
                  options={pregnancyOptions}
                  selected={form.pregnancy ? [form.pregnancy] : []}
                  onToggle={(v) => set('pregnancy', v)}
                />
              </Field>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Have you been diagnosed with any of these?" hint="Select all that apply">
              <ChipGroup options={chronicConditions} selected={form.conditions} onToggle={(v) => toggle('conditions', v)} multi />
            </Field>
            <Field label="Anything else?">
              <TextInput
                value={form.conditionsOther}
                onChange={(v) => set('conditionsOther', v)}
                placeholder="Other conditions not listed above"
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Past surgeries or hospitalisations" hint="Select all that apply">
              <ChipGroup options={surgicalHistory} selected={form.surgeries} onToggle={(v) => toggle('surgeries', v)} multi />
            </Field>
            <Field label="Drug allergies" hint="Important — helps flag unsafe prescriptions">
              <ChipGroup options={drugAllergies} selected={form.drugAllergies} onToggle={(v) => toggle('drugAllergies', v)} multi />
            </Field>
            <Field label="Food & environmental allergies">
              <ChipGroup options={otherAllergies} selected={form.otherAllergies} onToggle={(v) => toggle('otherAllergies', v)} multi />
            </Field>
            <Field label="Allergy details">
              <TextInput
                value={form.allergiesNote}
                onChange={(v) => set('allergiesNote', v)}
                placeholder="Any other allergies, or what reaction you had"
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Medications you take long-term" hint="Select all that apply">
              <div className="space-y-3.5">
                {medicationClasses.map((group) => (
                  <div key={group.group}>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {group.group}
                    </p>
                    <ChipGroup options={group.items} selected={form.medications} onToggle={(v) => toggle('medications', v)} multi />
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Other medications">
              <TextInput
                value={form.medicationsOther}
                onChange={(v) => set('medicationsOther', v)}
                placeholder="Anything else you take regularly"
              />
            </Field>
            <Field label="Family history" hint="Conditions in parents, siblings, or children">
              <ChipGroup options={familyHistory} selected={form.familyHistory} onToggle={(v) => toggle('familyHistory', v)} multi />
            </Field>
          </>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {lifestyleFields.map((f) => (
              <Field key={f.key} label={f.label}>
                <ChipGroup
                  options={f.options}
                  selected={form.lifestyle[f.key] ? [form.lifestyle[f.key]] : []}
                  onToggle={(v) => setLifestyle(f.key, v)}
                />
              </Field>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {onCancel ? 'Cancel' : ''}
          </button>
        )}

        <button
          type="button"
          onClick={next}
          className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
        >
          {isLast ? (
            <>
              <Check size={15} /> Save &amp; continue
            </>
          ) : (
            <>
              Next <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <ClipboardList size={13} className="mt-0.5 shrink-0" />
        Fields follow standard clinical intake structure. This isn't a diagnosis — always confirm medication changes
        with your doctor.
      </p>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {hint && (
          <span className="ml-1.5 font-normal" style={{ color: 'var(--text-muted)' }}>
            · {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, inputMode }) {
  return (
    <input
      value={value}
      inputMode={inputMode}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
    />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function ChipGroup({ options, selected, onToggle, multi = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={active}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: active ? 'var(--brand-on)' : 'var(--text-secondary)',
              background: active ? 'var(--brand)' : 'var(--surface-1)',
              border: `1px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            {multi && active ? '✓ ' : ''}
            {o}
          </button>
        )
      })}
    </div>
  )
}
