import React, { useState } from 'react'

export default function CovoImmoApp(){
  const [step, setStep] = useState('home')
  const [selectedListing, setSelectedListing] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [contractText, setContractText] = useState('')

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    lifestyle: '',
    pets: false,
    smoker: false,
  })

  const listings = [
    {
      id: 1,
      title: 'Maison partagée à Liège',
      description: '3 chambres, jardin, proche des transports. Co-location à partir de 500€/mois.',
      photos: ['/logo.png','/logo.png'],
      colocataires: [{name:'Sophie',age:28},{name:'Marc',age:32}],
      localisation: 'Liège centre',
      noPets: true,
      noSmoking: true,
    }
  ]

  const handleProfile = (field, value) => {
    setProfile(prev => ({...prev, [field]: value}))
  }

  const handleSendMessage = () => {
    if(!newMessage.trim()) return
    setMessages(prev => [...prev, {from:'me', text:newMessage}])
    setNewMessage('')
  }

  const calculateCompatibility = (user, listing) => {
    let score = 100
    if (user.pets && listing.noPets) score -= 30
    if (user.smoker && listing.noSmoking) score -= 20
    const ages = listing.colocataires.map(c=>c.age)
    if(ages.length){
      const avg = ages.reduce((a,b)=>a+b,0)/ages.length
      if (Math.abs(avg - (Number(user.age)||0)) > 10) score -= 10
    }
    const keywords = ['calme','fête','sport','télétravail']
    const found = keywords.some(k => (user.lifestyle||'').toLowerCase().includes(k))
    if(found) score += 10
    return Math.max(0, Math.min(100, score))
  }

  const generateContract = () => {
    const contract = `Contrat simplifié de co-location

Entre les soussignés :
- ${profile.name || '[Nom]'}, âgé(e) de ${profile.age || '[Âge]'} ans, ci-après désigné(e) comme "Cohabitant 1"
- [Nom du colocataire], ci-après désigné(e) comme "Cohabitant 2"

Objet : Co-location du logement situé à ${selectedListing?.localisation || '[Localisation]'} 

Conditions :
- Loyer mensuel : 500€ / personne
- Partage des charges : équitable
- Durée : 1 an renouvelable
- Règlement intérieur : respect, propreté, communication

Fait à Liège, le [date]

Signatures :
________________________     ________________________
Cohabitant 1                  Cohabitant 2`
    setContractText(contract)
    setStep('contract')
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#2F2F2F]">
      <header className="p-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="CovoImmo" className="w-10 h-10 rounded-lg"/>
          <h1 className="text-3xl font-bold">CovoImmo</h1>
        </div>
        <p className="text-sm text-gray-600 mt-2">Habiter autrement, ensemble.</p>
      </header>

      {step === 'home' && (
        <div className="max-w-xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Que cherchez-vous ?</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="py-2 rounded-xl bg-[#6DA7D4] text-white">Co-location</button>
              <button className="py-2 rounded-xl bg-white border">Co-achat</button>
            </div>
            <div className="space-y-3">
              <input placeholder="Ville ou code postal" className="w-full border rounded-xl p-3"/>
              <input placeholder="Budget max (€)" type="number" className="w-full border rounded-xl p-3"/>
              <button onClick={()=>setStep('profile')} className="w-full py-3 rounded-xl bg-[#6DA7D4] text-white">Continuer</button>
            </div>
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div className="max-w-xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Mon profil</h2>
            <div className="flex gap-3 items-center">
              <img src="/logo.png" className="w-10 h-10 rounded-full" alt="avatar"/>
              <input value={profile.name} onChange={e=>handleProfile('name', e.target.value)} placeholder="Nom complet" className="flex-1 border rounded-xl p-3"/>
            </div>
            <div>
              <label className="text-sm">Âge</label>
              <input type="number" value={profile.age} onChange={e=>handleProfile('age', e.target.value)} className="w-full border rounded-xl p-3"/>
            </div>
            <div>
              <label className="text-sm">Style de vie (calme, sociable, télétravail…)</label>
              <input value={profile.lifestyle} onChange={e=>handleProfile('lifestyle', e.target.value)} className="w-full border rounded-xl p-3"/>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.pets} onChange={e=>handleProfile('pets', e.target.checked)}/> J’ai des animaux</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.smoker} onChange={e=>handleProfile('smoker', e.target.checked)}/> Je fume</label>
            </div>
            <button onClick={()=>setStep('results')} className="w-full py-3 rounded-xl bg-[#6DA7D4] text-white">Rechercher un logement</button>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="max-w-2xl mx-auto p-6">
          <button onClick={()=>setStep('home')} className="mb-4 text-sm">← Retour</button>
          <h2 className="text-2xl font-bold mb-4">Résultats</h2>
          <div className="space-y-3">
            {listings.map(item => {
              const score = calculateCompatibility(profile, item)
              return (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 cursor-pointer" onClick={()=>{setSelectedListing(item); setStep('details')}}>
                  <div className="flex items-center gap-3">
                    <img src={item.photos[0]} alt="" className="w-20 h-14 object-cover rounded-lg"/>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm mt-1 text-green-700">Compatibilité : {score}%</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {step === 'details' && selectedListing && (
        <div className="max-w-3xl mx-auto p-6">
          <button onClick={()=>setStep('results')} className="mb-4 text-sm">← Retour aux résultats</button>
          <h2 className="text-2xl font-bold mb-3">{selectedListing.title}</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            {selectedListing.photos.map((src,i)=>(
              <img key={i} src={src} alt={`photo ${i+1}`} className="w-full h-56 object-cover rounded-xl"/>
            ))}
          </div>
          <p className="text-gray-700 mb-3">{selectedListing.description}</p>
          <h3 className="font-semibold mb-1">Colocataires actuels :</h3>
          <ul className="list-disc ml-5 mb-3 text-gray-700">
            {selectedListing.colocataires.map((c,i)=>(<li key={i}>{c.name}, {c.age} ans</li>))}
          </ul>
          <p className="text-sm text-gray-500 mb-4">📍 Localisation : {selectedListing.localisation}</p>
          <div className="flex gap-3">
            <button onClick={()=>setStep('chat')} className="px-4 py-2 rounded-xl bg-[#6DA7D4] text-white">Contacter les colocataires</button>
            <button onClick={generateContract} className="px-4 py-2 rounded-xl border">Générer un contrat</button>
          </div>
        </div>
      )}

      {step === 'chat' && (
        <div className="max-w-xl mx-auto p-6">
          <button onClick={()=>setStep('details')} className="mb-4 text-sm">← Retour à l'annonce</button>
          <h2 className="text-2xl font-bold mb-3">Messagerie</h2>
          <div className="bg-white rounded-xl shadow p-4 mb-3 h-80 overflow-y-auto">
            {messages.map((m,i)=>(
              <div key={i} className={
                "mb-2 p-2 rounded-lg max-w-xs " + (m.from==='me' ? "bg-blue-100 ml-auto" : "bg-gray-200")
              }>{m.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border rounded-xl p-3" placeholder="Votre message…" value={newMessage} onChange={e=>setNewMessage(e.target.value)}/>
            <button onClick={handleSendMessage} className="px-4 py-2 rounded-xl bg-[#6DA7D4] text-white">Envoyer</button>
          </div>
        </div>
      )}

      {step === 'contract' && (
        <div className="max-w-3xl mx-auto p-6">
          <button onClick={()=>setStep('details')} className="mb-4 text-sm">← Retour à l'annonce</button>
          <h2 className="text-2xl font-bold mb-3">Contrat de co-location</h2>
          <textarea readOnly value={contractText} className="w-full h-96 p-3 border rounded-xl font-mono text-sm"></textarea>
        </div>
      )}
    </div>
  )
}
