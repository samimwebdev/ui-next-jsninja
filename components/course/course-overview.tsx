import { Check } from 'lucide-react'

const overviewSections = [
  {
    title: 'কী কী শিখবেন এ কোর্স থেকে?',
    items: [
      'ফেসবুকের সর্বাধিক ব্যবহার',
      'ইউটিউবের জনপ্রিয় মার্কেট-প্লেস',
      'সার্চিং টিপস, সেওপটিমাইজ ও টার্গেটিং',
    ],
  },
  {
    title: 'কোর্সটি যাদের জন্য',
    items: ['জব অ্যাপ্লিক্যান্ট', 'ভার্সিটি-লেভেলের শিক্ষার্থী'],
  },
  {
    title: 'কোর্সটি করার জন্য আপনি কী কী জানা থাকা দরকার?',
    items: ['কম্পিউটার / স্মার্টফোন / ল্যাপ', 'ইন্টারনেট এক্সেস'],
  },
  {
    title: 'যে সকল সুবিধা পাবেন',
    items: ['ইনবিল্ট এক্সপার্ট সাপোর্ট সিস্টেম', 'অনলিমিটেড এক্সেস এক্সেস'],
  },
]

export function Overview() {
  return (
    <section id="overview" className="my-12">
      <div className="grid gap-8 md:grid-cols-2">
        {overviewSections.map((section, index) => (
          <div key={index} className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#E91E63] mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
