import { Dialog, DialogContent } from './ui/dialog';
import { useState } from 'react';

export const OnboardingDialog = () => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className='max-w-md'>
        <div className='relative'>
          {/* <button
            onClick={() => setOpen(false)}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-3xl"
            aria-label="Close"
          >
            ×
          </button> */}
          <div className='text-xl pt-8'>
            Hello world, this is the onboarding dialog!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};