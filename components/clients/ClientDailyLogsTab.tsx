import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, X, Edit2, CheckCircle2, Circle, AlertCircle, FileText } from 'lucide-react';
import CustomCalendarIcon, { CustomCalendarIcon as CalendarIcon } from '../icons/CustomCalendarIcon';
import { Client } from '../../types';

interface ClientDailyLogsTabProps {
  client?: Client;
}

export const ClientDailyLogsTab: React.FC<ClientDailyLogsTabProps> = ({ client }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Hábitos Diários & Marcadores</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhamento semanal de água, sono, passos, biofeedback e rotina.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-3 min-w-[140px] text-center">
              29 Jun - 05 Jul
            </span>
            <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm">
            Hoje
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <Plus size={16} /> Novo Registo
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 w-48 sticky left-0 bg-slate-50 dark:bg-slate-900/90 z-10">Métrica</th>
                <th className="px-3 py-3 min-w-[100px] text-center">Seg<br/><span className="text-[10px] text-slate-400 font-normal">29 Jun</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center">Ter<br/><span className="text-[10px] text-slate-400 font-normal">30 Jun</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center">Qua<br/><span className="text-[10px] text-slate-400 font-normal">01 Jul</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center">Qui<br/><span className="text-[10px] text-slate-400 font-normal">02 Jul</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center">Sex<br/><span className="text-[10px] text-slate-400 font-normal">03 Jul</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center text-primary-600 dark:text-primary-400">Sáb<br/><span className="text-[10px] font-normal">04 Jul</span></th>
                <th className="px-3 py-3 min-w-[100px] text-center">Dom<br/><span className="text-[10px] text-slate-400 font-normal">05 Jul</span></th>
                <th className="px-4 py-3 min-w-[120px] text-center bg-slate-100/50 dark:bg-slate-800/50">Média<br/><span className="text-[10px] text-slate-400 font-normal">Semanal</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-400">
              
              {/* CATEGORIA: HÁBITOS E MARCADORES */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td colSpan={9} className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider sticky left-0">Hábitos e Marcadores</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Água (L)</td>
                <td className="px-3 py-2.5 text-center">2.5</td>
                <td className="px-3 py-2.5 text-center">3.0</td>
                <td className="px-3 py-2.5 text-center">2.8</td>
                <td className="px-3 py-2.5 text-center">2.5</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">3.2</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">2.8</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Passos</td>
                <td className="px-3 py-2.5 text-center">8500</td>
                <td className="px-3 py-2.5 text-center">10200</td>
                <td className="px-3 py-2.5 text-center">9500</td>
                <td className="px-3 py-2.5 text-center">7800</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">12000</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">9600</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Peso (kg)</td>
                <td className="px-3 py-2.5 text-center">75.2</td>
                <td className="px-3 py-2.5 text-center">75.0</td>
                <td className="px-3 py-2.5 text-center">75.1</td>
                <td className="px-3 py-2.5 text-center">74.9</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">74.8</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">75.0</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Sono (h)</td>
                <td className="px-3 py-2.5 text-center">7.5</td>
                <td className="px-3 py-2.5 text-center">8.0</td>
                <td className="px-3 py-2.5 text-center">6.5</td>
                <td className="px-3 py-2.5 text-center">7.0</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">8.5</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">7.5</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Fadiga (0-10)</td>
                <td className="px-3 py-2.5 text-center">5</td>
                <td className="px-3 py-2.5 text-center">4</td>
                <td className="px-3 py-2.5 text-center">6</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">3</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">5.0</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Stress (0-10)</td>
                <td className="px-3 py-2.5 text-center">4</td>
                <td className="px-3 py-2.5 text-center">3</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">5</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">2</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">4.2</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Força (0-10)</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">9</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">8</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">8.0</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Forma (0-10)</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">8</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">7.6</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Recuperação (0-10)</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">6</td>
                <td className="px-3 py-2.5 text-center">6</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">9</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">7.2</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Bem-estar (0-10)</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">6</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">9</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">7.4</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Humor</td>
                <td className="px-3 py-2.5 text-center">😊</td>
                <td className="px-3 py-2.5 text-center">😊</td>
                <td className="px-3 py-2.5 text-center">😐</td>
                <td className="px-3 py-2.5 text-center">😐</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">😁</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Observações</td>
                <td className="px-3 py-2.5 text-center"><FileText size={16} className="mx-auto text-slate-400" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center"><FileText size={16} className="mx-auto text-primary-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">-</td>
              </tr>
              
              {/* CATEGORIA: NUTRIÇÃO */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td colSpan={9} className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider sticky left-0">Nutrição</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Calorias (kcal)</td>
                <td className="px-3 py-2.5 text-center">2100</td>
                <td className="px-3 py-2.5 text-center">2150</td>
                <td className="px-3 py-2.5 text-center">2050</td>
                <td className="px-3 py-2.5 text-center">2200</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">2400</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">2180</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Proteína (g)</td>
                <td className="px-3 py-2.5 text-center text-rose-500">160</td>
                <td className="px-3 py-2.5 text-center text-rose-500">165</td>
                <td className="px-3 py-2.5 text-center text-rose-500">155</td>
                <td className="px-3 py-2.5 text-center text-rose-500">160</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center font-medium text-rose-500">150</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold text-rose-600 dark:text-rose-400 bg-slate-50 dark:bg-slate-800/50">158</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Hidratos (g)</td>
                <td className="px-3 py-2.5 text-center text-blue-500">200</td>
                <td className="px-3 py-2.5 text-center text-blue-500">210</td>
                <td className="px-3 py-2.5 text-center text-blue-500">190</td>
                <td className="px-3 py-2.5 text-center text-blue-500">220</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center font-medium text-blue-500">260</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/50">216</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Gorduras (g)</td>
                <td className="px-3 py-2.5 text-center text-amber-500">60</td>
                <td className="px-3 py-2.5 text-center text-amber-500">65</td>
                <td className="px-3 py-2.5 text-center text-amber-500">60</td>
                <td className="px-3 py-2.5 text-center text-amber-500">65</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center font-medium text-amber-500">80</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold text-amber-600 dark:text-amber-400 bg-slate-50 dark:bg-slate-800/50">66</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Fibras (g)</td>
                <td className="px-3 py-2.5 text-center text-emerald-500">25</td>
                <td className="px-3 py-2.5 text-center text-emerald-500">30</td>
                <td className="px-3 py-2.5 text-center text-emerald-500">22</td>
                <td className="px-3 py-2.5 text-center text-emerald-500">28</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center font-medium text-emerald-500">35</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800/50">28</td>
              </tr>
              
              {/* CATEGORIA: TREINO */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td colSpan={9} className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider sticky left-0">Treino</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Treino Realizado</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><Circle size={16} className="mx-auto text-slate-300 dark:text-slate-600" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><Circle size={16} className="mx-auto text-slate-300 dark:text-slate-600" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">3</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Duração (min)</td>
                <td className="px-3 py-2.5 text-center">65</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">55</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">75</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">65</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Intensidade (0-10)</td>
                <td className="px-3 py-2.5 text-center">8</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">7</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-primary-600 dark:text-primary-400 font-medium">9</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">8.0</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Tipo de Treino</td>
                <td className="px-3 py-2.5 text-center text-xs">Inferiores</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-xs">Superiores</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center text-xs text-primary-600 dark:text-primary-400 font-medium">Full Body</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Observações</td>
                <td className="px-3 py-2.5 text-center"><FileText size={16} className="mx-auto text-slate-400" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center"><FileText size={16} className="mx-auto text-primary-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">-</td>
              </tr>
              
              {/* CATEGORIA: SUPLEMENTOS */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td colSpan={9} className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider sticky left-0">Suplementos</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Whey Protein</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">100%</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 font-medium sticky left-0 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Creatina (5g)</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><Circle size={16} className="mx-auto text-slate-300 dark:text-slate-600" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-3 py-2.5 text-center"><CheckCircle2 size={16} className="mx-auto text-emerald-500" /></td>
                <td className="px-3 py-2.5 text-center">-</td>
                <td className="px-4 py-2.5 text-center font-bold bg-slate-50 dark:bg-slate-800/50">80%</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Novo Registo Diário</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">04 Jul 2026</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
              
              {/* Hábitos e Marcadores */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Hábitos e Marcadores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Água (L)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Passos</label>
                    <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Peso (kg)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Sono (h)</label>
                    <input type="number" step="0.5" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Stress (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Fadiga (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Força (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Forma (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Recuperação (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Bem-estar (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Humor</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      <option value="">Selecione...</option>
                      <option value="otimo">Ótimo (😁)</option>
                      <option value="bom">Bom (😊)</option>
                      <option value="normal">Normal (😐)</option>
                      <option value="baixo">Baixo (😔)</option>
                      <option value="irritado">Irritado (😠)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Observações Rápidas</label>
                  <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                </div>
              </section>

              {/* Nutrição */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Nutrição
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Calorias</label>
                    <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Proteína (g)</label>
                    <input type="number" className="w-full bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 text-rose-700 dark:text-rose-400 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Hidratos (g)</label>
                    <input type="number" className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Gorduras (g)</label>
                    <input type="number" className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Fibras (g)</label>
                    <input type="number" className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              </section>

              {/* Treino */}
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Treino
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Treino Realizado</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Duração (min)</label>
                    <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Intensidade (0-10)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tipo de Treino</label>
                    <input type="text" placeholder="Ex: Inferiores" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Observações do Treino</label>
                  <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                </div>
              </section>
              
              {/* Suplementos */}
              <section>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Suplementos
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Whey Protein</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Creatina (5g)</span>
                  </label>
                </div>
              </section>

            </div>
            
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                <Save size={16} /> Gravar Registo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
