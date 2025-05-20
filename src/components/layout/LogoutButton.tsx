
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

const LogoutButton = () => {
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        className="w-full justify-start hover:bg-admin-accent-blue/10 text-admin-text-muted hover:text-white"
        onClick={() => setOpen(true)}
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>{t('common.logout')}</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-admin-bg-secondary border border-admin-border-light">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {t('auth.logoutConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-admin-text-secondary">
              {t('auth.logoutConfirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-admin-bg-tertiary text-white border-admin-border-light hover:bg-admin-bg-highlight">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-admin-accent-blue text-white hover:bg-admin-accent-blue/90"
              onClick={handleLogout}
            >
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
