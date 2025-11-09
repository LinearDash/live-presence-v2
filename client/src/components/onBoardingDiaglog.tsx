import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { useState } from 'react';

export const OnboardingDialog = () => {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-md border-2 shadow-xl'>
        {/* Content */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">👋</div>
          <DialogTitle className="text-3xl font-bold tracking-tight">
            Welcome to Live Presence
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Let's get you set up
          </DialogDescription>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow"
            >
              Get Started
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};