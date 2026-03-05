import Link from "next/link";
import { Github, Globe, ExternalLink } from "lucide-react";

export default function FooterDark() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-4xl font-black text-white italic">DREAM SHOP.</h2>
            <p className="max-w-sm text-neutral-400 leading-relaxed">
              Redefining the digital marketplace with unparalleled speed, security, and style. Join thousands of happy customers today.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                Shop Now
              </button>
            </div>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Journal</Link></li>
                <li><Link href="#" className="hover:text-primary">Press</Link></li>
              </ul>
            </div>
            {/* Add more categories here */}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-neutral-800 gap-4">
          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> EN</span>
            <span className="flex items-center gap-1"><ExternalLink className="w-4 h-4" /> Status</span>
          </div>
          <p className="text-xs text-neutral-500">
            Powered by JS Web Devs Stack v3.0
          </p>
        </div>
      </div>
    </footer>
  );
}