import useImports from '@/hooks/use-imports';
import { Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import React from 'react'

export default function StoreFeatures() {
 const {t}=useImports()
    return (
    <div> <div className="container">
                 <div className=" border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                       

                        {[
                            {
                                icon: Truck,
                                title: t("feature.free_shipping"),
                                desc: t("feature.free_shipping_desc"),
                            },
                            {
                                icon: RotateCcw,
                                title: t("feature.easy_returns"),
                                desc: t("feature.easy_returns_desc"),
                            },
                            {
                                icon: ShieldCheck,
                                title: t("feature.secure_payment"),
                                desc: t("feature.secure_payment_desc"),
                            },
                            {
                                icon: Headset,
                                title: t("feature.24_7_support"),
                                desc: t("feature.24_7_support_desc"),
                            },
                        ].map((f) => {
                            const Icon = f.icon;

                            return (
                                <div
                                    key={f.title}
                                    className="group flex items-center gap-4 px-6 py-5 hover:bg-orange-50 transition-colors"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <Icon size={24} strokeWidth={2} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {f.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-white mt-1">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            </div></div>
  )
}
