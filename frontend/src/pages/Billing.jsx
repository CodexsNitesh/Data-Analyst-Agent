import { useState, useEffect } from 'react'
import { Check, Zap, CreditCard } from 'lucide-react'
import { getPlans, getSubscription, createCheckout } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

export default function Billing() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    Promise.all([getPlans(), getSubscription()])
      .then(([p, s]) => { setPlans(p.data.plans); setSubscription(s.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    try {
      const res = await createCheckout()
      window.location.href = res.data.checkout_url
    } catch (err) {
      alert('Billing not configured. Add Stripe keys to continue.')
    } finally {
      setCheckoutLoading(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-muted text-sm mt-1">Current plan: <Badge color={user?.plan === 'pro' ? 'blue' : 'gray'}>{user?.plan?.toUpperCase()}</Badge></p>
      </div>

      {subscription && (
        <Card className="p-5 mb-8">
          <h2 className="font-semibold text-white mb-3">Current Usage</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted mb-1">Plan</p>
              <p className="text-white font-medium capitalize">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-muted mb-1">Status</p>
              <Badge color={subscription.status === 'active' ? 'green' : 'yellow'}>{subscription.status}</Badge>
            </div>
            <div>
              <p className="text-muted mb-1">Queries Used</p>
              <p className="text-white font-medium">{subscription.queries_used ?? 0}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = user?.plan === plan.id
          return (
            <Card key={plan.id} className={`p-6 ${plan.id === 'pro' ? 'border-blue-500/30' : ''}`}>
              {plan.id === 'pro' && (
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Zap size={12} fill="currentColor" /> Most Popular
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <Check size={14} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrentPlan ? (
                <Button variant="secondary" className="w-full" disabled>Current Plan</Button>
              ) : plan.id === 'pro' ? (
                <Button className="w-full" onClick={handleUpgrade} loading={checkoutLoading}>
                  <CreditCard size={14} /> Upgrade to Pro
                </Button>
              ) : null}
            </Card>
          )
        })}
      </div>
    </div>
  )
}