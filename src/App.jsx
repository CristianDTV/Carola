import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Heart, MapPin, X, Lock } from 'lucide-react';

import foto1 from './images/foto1.jpg';
import foto2 from './images/foto2.jpg';
import foto3 from './images/foto3.jpg';

const RomanticCountdown = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Estado para la fecha actual (para asegurar sincronización)
  const [todayDate, setTodayDate] = useState(new Date());

  const hashPassword = async (pwd) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    const hashedInput = await hashPassword(password);
    const correctHash = await hashPassword('Carola2025'); 
    
    if (hashedInput === correctHash) {
      setShowPasswordModal(false);
      setShowLetter(true);
      setPassword('');
    } else {
      setPasswordError('❌ Clave incorrecta. Intenta de nuevo.');
      setPassword('');
    }
  };

  const handleDay13Click = () => {
    setShowPasswordModal(true);
  };

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      setTodayDate(now); // Actualizamos el estado de "hoy"
      
      const meetingDate = new Date(2025, 11, 13); // 13 Diciembre 2025
      meetingDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      const diffTime = meetingDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    };
    
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  // Arrays de días
  const daysInDecember = Array.from({ length: 31 }, (_, i) => i + 1);
  const daysInNovember = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // AJUSTE DE CALENDARIOS 2025 (Corregido)
  // 1 Nov 2025 es Sábado (índice 6)
  const novemberStartDay = 6; 
  // 1 Dic 2025 es Lunes (índice 1)
  const startDay = 1; 

  // URLs de imágenes (puedes cambiarlas por las tuyas importadas)
  const memories = [
    { rotate: -6, delay: 0.3, image: foto1, caption: 'Nuestros recuerdos' },
    { rotate: 3, delay: 0.5, image: foto2, caption: 'La más hermosa' },
    { rotate: -4, delay: 0.7, image: foto3, caption: 'Inicios Juntos' }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header y Fotos */}
            <div className="mb-12 relative">
              <motion.h1 
                className="text-center text-5xl md:text-7xl mb-12 text-gray-700"
                style={{ fontFamily: 'Dancing Script, cursive' }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                Algunas fotitos especiales
              </motion.h1>

              <div className="flex justify-center gap-8 flex-wrap mb-16">
                {memories.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    className="relative"
                    initial={{ y: -100, opacity: 0, rotate: 0 }}
                    animate={{ y: 0, opacity: 1, rotate: photo.rotate }}
                    transition={{ 
                      delay: photo.delay, 
                      type: 'spring',
                      stiffness: 100 
                    }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                  >
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded-sm z-10"
                      style={{
                        background: 'rgba(240, 220, 180, 0.7)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div 
                      className="bg-white p-3 pb-12 shadow-xl"
                      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
                    >
                      <img
                        src={photo.image}
                        alt={`Memory ${idx + 1}`}
                        className="w-full h-full object-cover"
                        style={{ width: '250px', height: '250px' }}
                      />
                    </div>
                    <div 
                      className="absolute bottom-2 left-0 right-0 text-center text-gray-600 text-sm"
                      style={{ fontFamily: 'Caveat, cursive', fontSize: '18px' }}
                    >
                      {photo.caption}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="text-center mb-12"
              >
                <div className="inline-block bg-white rounded-2xl px-8 py-6 shadow-lg border-4 border-pink-100">
                  <p className="text-gray-600 text-lg mb-2" style={{ fontFamily: 'Caveat, cursive', fontSize: '24px' }}>
                    Faltan
                  </p>
                  <p className="text-6xl font-bold text-rose-400 mb-2">
                    {daysRemaining}
                  </p>
                  <p className="text-gray-600 text-lg" style={{ fontFamily: 'Caveat, cursive', fontSize: '24px' }}>
                    días para verte ❤️
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Calendarios */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #fef9f5 100%)' }}
            >
              {/* Decoración esquinas */}
              <div className="absolute top-0 left-0 w-20 h-20 opacity-20">
                <div className="absolute top-4 left-4 w-12 h-1 bg-rose-300 rounded rotate-45" />
                <div className="absolute top-4 left-4 w-1 h-12 bg-rose-300 rounded rotate-45" />
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20">
                <div className="absolute bottom-4 right-4 w-12 h-1 bg-rose-300 rounded -rotate-45" />
                <div className="absolute bottom-4 right-4 w-1 h-12 bg-rose-300 rounded -rotate-45" />
              </div>

              <h2 
                className="text-4xl md:text-5xl text-center mb-8 text-gray-700"
                style={{ fontFamily: 'Dancing Script, cursive' }}
              >
                Conteo hasta nuestro encuentro
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* CALENDARIO NOVIEMBRE 2025 */}
                <div className="relative">
                  <h3 
                    className="text-2xl md:text-3xl text-center mb-4 text-gray-600"
                    style={{ fontFamily: 'Dancing Script, cursive' }}
                  >
                    Noviembre 2025
                  </h3>
                  
                  <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="text-center font-semibold text-gray-500 text-xs md:text-sm">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 md:gap-3">
                    {Array.from({ length: novemberStartDay }).map((_, idx) => (
                      <div key={`empty-nov-${idx}`} />
                    ))}

                    {daysInNovember.map((day) => {
                      // Lógica REAL para Noviembre 2025
                      const dateToCheck = new Date(2025, 10, day); // Mes 10 = Noviembre
                      dateToCheck.setHours(0,0,0,0);
                      const todayZero = new Date(todayDate);
                      todayZero.setHours(0,0,0,0);

                      const isToday = dateToCheck.getTime() === todayZero.getTime();
                      const isPast = dateToCheck < todayZero;

                      return (
                        <motion.div
                          key={`nov-${day}`}
                          className={`
                            relative aspect-square flex items-center justify-center rounded-lg text-sm md:text-base
                            transition-all duration-300
                          `}
                          style={{
                            background: isToday 
                              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' // Amarillo si es hoy
                              : isPast
                              ? 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)' // Verde si ya pasó
                              : '#f5f5f4', // Gris/Blanco si falta
                            boxShadow: isToday ? '0 4px 12px rgba(245, 158, 11, 0.4)' : isPast ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                            opacity: isPast ? 0.7 : 1
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: isPast ? 0.7 : 1 }}
                          transition={{ delay: 0.5 + (day * 0.01) }}
                        >
                          {isPast && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-white"
                              >
                                ✓
                              </motion.div>
                            </div>
                          )}
                          {isToday && (
                            <>
                              <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1 shadow-lg z-10 animate-pulse">
                                <Heart className="w-3 h-3 text-white fill-white" />
                              </div>
                              <div 
                                className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap text-amber-600 font-semibold"
                                style={{ fontFamily: 'Caveat, cursive', fontSize: '12px' }}
                              >
                                ¡Hoy! 💛
                              </div>
                            </>
                          )}
                          <span className={`${isToday ? 'text-white font-bold' : isPast ? 'text-white font-semibold' : 'text-gray-600'}`}>
                            {day}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* CALENDARIO DICIEMBRE 2025 */}
                <div className="relative">
                  <h3 
                    className="text-2xl md:text-3xl text-center mb-4 text-gray-600"
                    style={{ fontFamily: 'Dancing Script, cursive' }}
                  >
                    Diciembre 2025
                  </h3>

                  <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="text-center font-semibold text-gray-500 text-xs md:text-sm">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 md:gap-3 relative">
                    {/* SVG para la línea animada */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f472b6" />
                          <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 50 150 Q 200 100, 350 150 T 650 150"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="10 5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                      />
                    </svg>

                    {Array.from({ length: startDay }).map((_, idx) => (
                      <div key={`empty-${idx}`} />
                    ))}

                    {daysInDecember.map((day) => {
                      // Lógica REAL para Diciembre 2025
                      const dateToCheck = new Date(2025, 11, day); // Mes 11 = Diciembre
                      dateToCheck.setHours(0,0,0,0);
                      const todayZero = new Date(todayDate);
                      todayZero.setHours(0,0,0,0);

                      const isToday = dateToCheck.getTime() === todayZero.getTime();
                      const isPast = dateToCheck < todayZero;
                      
                      const isStartDay = day === 11;
                      const isEndDay = day === 13;
                      const isInBetween = day === 12;
                      const isClickable = isEndDay;
                      
                      const isPastSpecial = (isStartDay || isEndDay || isInBetween) && isPast;

                      return (
                        <motion.div
                          key={day}
                          className={`
                            relative aspect-square flex items-center justify-center rounded-lg text-sm md:text-base
                            transition-all duration-300
                            ${isClickable ? 'cursor-pointer hover:scale-110' : ''}
                            ${isStartDay || isEndDay || isInBetween ? 'font-bold' : 'font-normal'}
                          `}
                          style={{
                            background: isPastSpecial
                              ? 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)'
                              : isToday
                              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                              : isStartDay 
                              ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                              : isEndDay
                              ? 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
                              : isInBetween
                              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                              : isPast
                              ? 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)'
                              : '#fafaf9',
                            zIndex: isStartDay || isEndDay ? 2 : 0,
                            boxShadow: (isStartDay || isEndDay) && !isPast ? '0 4px 12px rgba(0,0,0,0.15)' : isPast ? '0 2px 8px rgba(34, 197, 94, 0.2)' : 'none',
                            opacity: isPast && !(isStartDay || isEndDay || isInBetween) ? 0.6 : 1
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: isPast && !(isStartDay || isEndDay || isInBetween) ? 0.6 : 1 }}
                          transition={{ delay: 1 + (day * 0.02) }}
                          whileHover={isClickable ? { scale: 1.15 } : {}}
                          onClick={isClickable ? handleDay13Click : undefined}
                        >
                          {isPast && !isToday && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-white text-lg"
                              >
                                ✓
                              </motion.div>
                            </div>
                          )}

                          {isStartDay && !isPast && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow-lg z-10">
                              <Plane className="w-3 h-3 text-white" />
                            </div>
                          )}

                          {isEndDay && !isPast && (
                            <>
                              <div className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 shadow-lg z-10 animate-pulse">
                                <Lock className="w-3 h-3 text-white" />
                              </div>
                              <div 
                                className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap text-rose-500 font-semibold"
                                style={{ fontFamily: 'Caveat, cursive', fontSize: '12px' }}
                              >
                                🔒 Carta
                              </div>
                            </>
                          )}

                          {isToday && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1 shadow-lg z-10 animate-pulse">
                              <Heart className="w-3 h-3 text-white fill-white" />
                            </div>
                          )}

                          <span className={`
                            ${isToday ? 'text-white font-bold' : ''}
                            ${isPast && !isToday ? 'text-white font-semibold' : ''}
                            ${!isPast && !isToday && (isStartDay || isEndDay) ? 'text-gray-700' : ''}
                            ${!isPast && !isToday && !isStartDay && !isEndDay ? 'text-gray-600' : ''}
                          `}>
                            {day}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Leyenda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="flex flex-wrap justify-center gap-4 mb-8 text-sm"
                style={{ fontFamily: 'Caveat, cursive', fontSize: '16px' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white text-xs">✓</div>
                  <span>Días Pasados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 to-amber-500"></div>
                  <span>Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-200 to-blue-300"></div>
                  <span>Salida (11 Dic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-200 to-yellow-300"></div>
                  <span>Viaje (12 Dic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-200 to-pink-300"></div>
                  <span>¡Llegada! (13 Dic)</span>
                </div>
              </motion.div>

              <motion.button
                onClick={handleDay13Click}
                className="mt-4 mx-auto block bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
              >
                🔒 Abrir Carta de Amor
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="max-w-3xl mx-auto relative"
          >
            <motion.button
              onClick={() => setShowLetter(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg z-20 hover:bg-gray-100"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>

            <div 
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom, #fffbf5 0%, #fff5eb 100%)',
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.03) 31px, rgba(0,0,0,0.03) 32px)`
              }}
            >
              <div className="absolute top-4 right-4 text-rose-300 opacity-20">
                <Heart className="w-16 h-16 fill-current" />
              </div>
              <div className="absolute bottom-4 left-4 text-pink-300 opacity-20">
                <Heart className="w-12 h-12 fill-current" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                <h2 
                  className="text-4xl md:text-5xl text-center mb-8 text-rose-500"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                >
                  Para el amor de mi vida
                </h2>

                <div 
                  className="text-gray-700 leading-relaxed space-y-6 text-base md:text-lg"
                  style={{ fontFamily: 'Caveat, cursive', fontSize: '22px', lineHeight: '2' }}
                >
                  <p>Mi amor,</p>
                  
                  <p>
                    CAda día que pasa sin verte se siente como una eternidad. Pero por suerte estamos a pocos dias de reencontrarnos
                    estoy muy emocionado de poder sentirte nuevamente, han sido dias complicados para nosotros dos, y tener a la 
                    persona que amas lejos es aun más complicado, pero igual estoy muy alegre de saber todo lo que estas logrando y todo
                    el esfuerzo que le estas metiendo, estoy muy orgullo de ti.
                  </p>

                  <p>
                    ROmpemos esa distancia el día sabado, cuando por fin pueda abrazarte y sentir tu calor, tengo pensado comprar unas flores para resibirte Jajaja,
                    y el sabado estar juntitos comiendo algo que te guste mucho, se que has estado extrañando la comida de Ecuador, ademas de eso, tambien quiero
                    que pases menos estres de todo lo que has estado haciendo, quiero que estes relajada y feliz.
                  </p>

                  <p>
                    LA distancia existe, pero nunca hacido mas fuerte de lo que sentimos. Siento que nuestra relación se ha fortalecido
                    a pesar de la distancia, y eso me llena de esperanza y amor por lo que viene, estamos a punto completar otra etapa juntos.
                    A pesar que no estes conmigo en ese momento importante de mi vida, siento que tu apoyo y amor me acompañan siempre.
                    Estaré pensando en ti en esos momento especiales, y sé que pronto podremos celebrar juntos.
                  </p>

                  <p>
                    Es un poco tiempo que nos veremos, casi un mes, pero espero que podamos aprovecharlo al máximo, quiero
                    crear nuevos recuerdos contigo, explorar nuevos lugares, y simplemente disfrutar de cada momento a tu lado.
                    Estoy seguro que este reencuentro será inolvidable para ambos y ps seguiremos construyendo nuestra historia juntos.
                  </p>

                  <p>
                    Te amo más de lo que las palabras pueden expresar. Gracias por estar en mi vida, gracias 
                    por ser mi persona, gracias por existir y gracias por hacerme tan feliz.
                  </p>

                  <div className="text-center mt-8">
                    <p className="text-2xl">Con todo mi amor,</p>
                    <p className="text-3xl mt-2 text-rose-500">Cristian Trávez 💕</p>
                  </div>

                  <div className="flex justify-center mt-8 gap-4">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                    <MapPin className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Contraseña */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-rose-100 rounded-full mb-4">
                  <Lock className="w-12 h-12 text-rose-500" />
                </div>
                <h3 
                  className="text-3xl mb-2 text-rose-500"
                  style={{ fontFamily: 'Dancing Script, cursive' }}
                >
                  Contenido Protegido
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Caveat, cursive', fontSize: '18px' }}>
                  Ingresa la clave especial para abrir la carta 💕
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Clave secreta..."
                    className="w-full px-4 py-3 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-400 transition-colors text-center text-lg"
                    style={{ fontFamily: 'Caveat, cursive' }}
                    autoFocus
                  />
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 text-center"
                      style={{ fontFamily: 'Caveat, cursive', fontSize: '16px' }}
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Desbloquear 💌
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RomanticCountdown;