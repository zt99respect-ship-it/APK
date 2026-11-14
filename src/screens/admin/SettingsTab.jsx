import { useEffect, useState } from 'react';
import { Button } from '../../components/ui.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { updateAppConfig } from '../../services/settings.js';

export default function SettingsTab() {
  const { config, notify } = useApp();
  const [maintenance, setMaintenance] = useState(config.maintenanceMode);
  const [announcement, setAnnouncement] = useState(config.announcement);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMaintenance(config.maintenanceMode);
    setAnnouncement(config.announcement);
  }, [config.maintenanceMode, config.announcement]);

  const save = async () => {
    setSaving(true);
    try {
      await updateAppConfig({ maintenanceMode: maintenance, announcement: announcement.trim().slice(0, 200) });
      notify('تم حفظ الإعدادات', 'success');
    } catch {
      notify('تعذر حفظ الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass flex items-center justify-between gap-4 rounded-3xl p-5">
        <div>
          <p className="text-sm font-bold text-zinc-50">وضع الصيانة</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">يمنع الأعضاء من استخدام التطبيق ويظهر لهم شاشة القفل.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={maintenance}
          onClick={() => setMaintenance((v) => !v)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${maintenance ? 'bg-brand' : 'bg-white/15'}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
              maintenance ? 'start-[22px]' : 'start-0.5'
            }`}
          />
        </button>
      </div>

      <label className="glass flex flex-col gap-3 rounded-3xl p-5">
        <span className="text-sm font-bold text-zinc-50">نص شريط الإعلانات</span>
        <textarea
          className="field min-h-24 resize-none"
          maxLength={200}
          placeholder="اتركه فارغاً لإخفاء الشريط"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
      </label>

      <Button onClick={save} loading={saving} className="w-full">
        حفظ الإعدادات
      </Button>
    </div>
  );
}
