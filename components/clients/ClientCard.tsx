import React, { useState } from 'react';
import { 
  Dumbbell, 
  Apple, 
  Activity, 
  Camera, 
  Calendar, 
  Clock, 
  CreditCard, 
  RotateCcw, 
  Mail, 
  Phone, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  AlertCircle, 
  AlertTriangle,
  Cake
} from 'lucide-react';
import { CustomChatIcon } from '../icons';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  todayStr: string;
  onSelect: () => void;
  onMessage: () => void;
  onContact: () => void;
  onDelete: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  todayStr,
  onSelect,
  onMessage,
  onContact,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive fallback initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'CL';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Contacts fallback
  const clientEmail = client.email || `${client.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@evolvepro.pt`;
  const clientPhone = client.phone || client.contact || '+351 912 345 678';

  // Expiry & days calculation
  const getPlanDaysInfo = (expiryDateStr?: string) => {
    if (!expiryDateStr) return null;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Expirado há ${Math.abs(diffDays)}d`, status: 'expired', days: diffDays };
    } else if (diffDays === 0) {
      return { label: 'Expira hoje', status: 'critical', days: 0 };
    } else if (diffDays <= 7) {
      return { label: `${diffDays}d restantes`, status: 'warning', days: diffDays };
    } else {
      return { label: `${diffDays}d restantes`, status: 'good', days: diffDays };
    }
  };

  const planDays = getPlanDaysInfo(client.paymentExpiryDate);

  // Attention indicators
  const hasWarning = client.status === 'warning';
  const hasExpiredPayment = planDays?.status === 'expired' || client.paymentStatus === 'expirado';
  const hasExpiringPayment = planDays?.status === 'warning' || planDays?.status === 'critical' || client.paymentStatus === 'a_expirar';
  const hasPendingValidation = client.evaluationStatus === 'por_validar';
  const isBirthdayToday = client.birthday === todayStr;

  const requiresAttention = hasWarning || hasExpiredPayment || hasExpiringPayment || hasPendingValidation;

  // Active module checks (Treino, Dieta, Cardio, Fotos)
  const isClientActive = client.status !== 'inactive';
  const planLower = (client.plan || '').toLowerCase();

  const hasTreino = isClientActive && Boolean(client.plan);
  const hasDieta = isClientActive && (
    Boolean(client.estrategia) || 
    planLower.includes('transform') || 
    planLower.includes('perda') || 
    planLower.includes('nutri') || 
    planLower.includes('dieta')
  );
  const hasCardio = isClientActive && (
    planLower.includes('perda') || 
    planLower.includes('transform') || 
    planLower.includes('cardio')
  );
  const hasFotos = isClientActive && (
    client.evaluationStatus === 'concluida' || 
    client.evaluationStatus === 'por_validar' ||
    planLower.includes('transform') ||
    planLower.includes('perda')
  );

  // Format date helper
  const formatDateWithoutYear = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }).replace('.', '');
  };

  const nextEvalFormatted = formatDateWithoutYear(client.nextEvaluationDate);

  // Border and accent styling: signature brand blue accent bar for each client
  const getCardAccentBorder = () => {
    return 'border-l-4 border-l-primary-500 hover:border-l-primary-600';
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer overflow-hidden p-3.5 sm:p-4 ${getCardAccentBorder()}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 lg:gap-4">
        
        {/* LEFT SECTION: Avatar, Identification & Contacts */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 lg:w-[32%] xl:w-[28%] shrink-0">
          {/* Avatar with fallback initials and status dot */}
          <div className="relative shrink-0">
            {!imgError && client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                onError={() => setImgError(true)}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm tracking-wider">
                {getInitials(client.name)}
              </div>
            )}
            
            {/* Status indicator dot */}
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                client.status === 'active'
                  ? 'bg-emerald-500'
                  : client.status === 'warning'
                  ? 'bg-rose-500 ring-2 ring-rose-400/30 animate-pulse'
                  : client.status === 'pending'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
              title={`Estado: ${client.status}`}
            />
          </div>

          {/* Name & Contacts */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                {client.name}
              </h3>
              
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                #{client.id.padStart(4, '0')}
              </span>

              {isBirthdayToday && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  <Cake size={11} /> Aniversário
                </span>
              )}
            </div>

            {/* Email & Phone linked under name */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  onContact();
                }}
                className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Ver contacto"
              >
                <Phone size={12} className="text-slate-400 shrink-0" />
                <span className="font-medium truncate max-w-[130px]">{clientPhone}</span>
              </span>

              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>

              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${clientEmail}`;
                }}
                className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title={`Enviar email para ${clientEmail}`}
              >
                <Mail size={12} className="text-slate-400 shrink-0" />
                <span className="truncate max-w-[160px]">{clientEmail}</span>
              </span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: Plan & Health / Tracking Indicator Chips */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Top row: Plan name & Time Left */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold">
              <Dumbbell size={13} className="text-primary-500 shrink-0" />
              <span className="font-bold">{client.plan}</span>
            </div>

            {/* Plan Time Remaining Chip */}
            {planDays && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                planDays.status === 'expired'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 font-bold'
                  : planDays.status === 'critical' || planDays.status === 'warning'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                <Clock size={11} className="shrink-0" />
                {planDays.label}
              </span>
            )}

            {/* Subscription status tag */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              client.hasSubscription 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              <RotateCcw size={11} className={client.hasSubscription ? 'text-blue-500' : 'text-slate-400'} />
              {client.hasSubscription ? 'Subscrição Ativa' : 'Sem Subscrição'}
            </span>
          </div>

          {/* Bottom row: Operational Tracking Chips (Estado, Treino, Dieta, Cardio, Fotos, Avaliação) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
            {/* Estado Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              client.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50'
                : client.status === 'warning'
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50'
                : client.status === 'pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                client.status === 'active' ? 'bg-emerald-500' : client.status === 'warning' ? 'bg-rose-500' : client.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
              {client.status === 'active' ? 'Ativo' : client.status === 'warning' ? 'Atenção' : client.status === 'pending' ? 'Pendente' : 'Inativo'}
            </span>

            {/* Treino Chip */}
            {hasTreino && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 shadow-2xs">
                <Dumbbell size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Treino</span>
              </span>
            )}

            {/* Dieta Chip */}
            {hasDieta && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 shadow-2xs">
                <Apple size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Dieta</span>
              </span>
            )}

            {/* Cardio Chip */}
            {hasCardio && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 shadow-2xs">
                <Activity size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Cardio</span>
              </span>
            )}

            {/* Fotos Chip */}
            {hasFotos && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 shadow-2xs">
                <Camera size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Fotos</span>
              </span>
            )}

            {/* Próxima Avaliação Chip */}
            {nextEvalFormatted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-slate-50 text-slate-700 border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60">
                <Calendar size={11} className="text-slate-400 shrink-0" />
                <span>Avaliação: {nextEvalFormatted}</span>
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Attention Badges & Quick Action Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
          
          {/* Attention indicator tag if required */}
          {requiresAttention && (
            <div className="flex items-center gap-1.5 mr-1">
              {hasWarning && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  <AlertCircle size={13} />
                  Feedback atrasado
                </span>
              )}
              {hasPendingValidation && !hasWarning && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <AlertTriangle size={13} />
                  Por validar
                </span>
              )}
              {hasExpiredPayment && !hasWarning && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  <CreditCard size={13} />
                  Expirado
                </span>
              )}
            </div>
          )}

          {/* Action buttons with tooltips */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {/* Mensagem */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMessage();
              }}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
              title="Enviar Mensagem"
              aria-label="Enviar Mensagem"
            >
              <CustomChatIcon size={16} />
            </button>

            {/* Contacto */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
              title="Ver Contacto"
              aria-label="Ver Contacto"
            >
              <Phone size={16} />
            </button>

            {/* Editar / Detalhes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
              title="Ver Perfil Completo"
              aria-label="Ver Perfil Completo"
            >
              <Edit2 size={16} />
            </button>

            {/* Eliminar / Suspender */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
              title="Opções / Eliminar"
              aria-label="Eliminar ou suspender"
            >
              <Trash2 size={16} />
            </button>

            {/* Chevron Right indicator */}
            <div className="hidden sm:flex items-center pl-1 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientCard;
