import React, { Suspense, useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import './style.css'

const mm = gsap.matchMedia()
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)

const hauteurTarget = 1

function useExternalRenderControl() {
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    const checkRender = () => {
      if (window.isLoaded === true) {
        setCanRender(true)
      }
    }

    // Vérifie immédiatement et à intervalles
    checkRender()
    const interval = setInterval(checkRender, 100)

    return () => clearInterval(interval)
  }, [])

  return canRender
}

export const CameraRigCarShow = ({ groundRef, spotLightRef1, spotLightRef2, carRef, carReady, carPosition }) => {
  const { camera } = useThree()
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5))
  const lookAtTarget = useRef(new THREE.Vector3(0, hauteurTarget, 0))
  const carTargetPosition = useRef(carPosition.clone())

  const logoElements = document.querySelectorAll('.logo-cyb, .logo-alp, .sep')
  const blocTxtElements = document.querySelectorAll('.carshow-container .surTitre span, .carshow-container h3')
  const otherTxtElements = document.querySelectorAll(
    '.carshow-container .cbk_diaporama-produit-sm__content-wrapper p, .cbk_diaporama-produit-sm__link'
  )

  const [isMobile, setIsMobile] = useState(false)

  const orbitState = useRef({
    height: 10,
    radius: 8
  })
  const angleRef = useRef({ value: 0 })

  const lightsOn = useRef(null)

  useEffect(() => {
    // ✅ Rends GSAP globalement accessible
    window.gsap = gsap
    window.ScrollTrigger = ScrollTrigger

    mm.add('(min-width: 1000px)', () => {
      setIsMobile(false)
    })

    mm.add('(max-width: 999px)', () => {
      setIsMobile(true)
    })
  }, [])

  useEffect(() => {
    if (!carReady || !carRef.current) return

    camera.position.set(0, 10, 5)

    const matrix = new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, new THREE.Vector3(0, hauteurTarget, 0))
    camera.quaternion.setFromRotationMatrix(matrix)
  }, [])

  useEffect(() => {
    const textAndOtherTl = gsap.timeline({ paused: true })
    if (blocTxtElements.length && otherTxtElements.length) {
      gsap.set(blocTxtElements, {
        x: 30,
        autoAlpha: 0
      })

      textAndOtherTl
        .to(blocTxtElements, {
          x: 0,
          autoAlpha: 1,
          stagger: 0.3,
          duration: 0.4,
          ease: 'cubic-bezier(.21,.65,.67,1)'
        })
        .to(
          otherTxtElements,
          {
            autoAlpha: 1,
            stagger: 0.3,
            duration: 0.4,
            ease: 'cubic-bezier(.21,.65,.67,1)'
          },
          '<80%'
        )
    }

    if (
      document.querySelector('.carshow-container') &&
      spotLightRef1.current &&
      spotLightRef2.current &&
      groundRef.current
    ) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.carshow-container',
          start: isMobile ? 'top top' : 'top top',
          end: isMobile ? '+=2000px' : '+=4000px',
          scrub: isMobile ? 1 : 2,
          pin: true,
          pinSpacing: true,
          markers: false,
          onUpdate: (self) => {
            mm.add('(min-width: 1000px)', () => {
              if (self.progress > 0.9) {
                textAndOtherTl.timeScale(1).play() // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse()
              }
            })
            mm.add('(max-width: 999px)', () => {
              if (self.progress > 0.99) {
                textAndOtherTl.timeScale(1).play() // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse() // ⏩ Retour 2x plus rapide
              }
            })
          },
          onUpdate: (e) => {
            if (e.progress < 0.15) {
              if (lightsOn.current !== true && spotLightRef2.current && spotLightRef1.current) {
                lightsOn.current = true
              }
            }
          },
        }
      })

      mm.add('(max-width: 999px)', () => {
        orbitState.current.radius = 12;
        // allume les lights
        gsap.to(spotLightRef2.current, {
          intensity: 2.5,
          ease: 'power3.in',
          duration: 1,
        })
        gsap.to(spotLightRef1.current, {
          intensity: 3.5,
          ease: 'power3.in',
          duration: 1
        })

        gsap.to(carTargetPosition.current, {
          x: -7,
          duration: 2,

          ease: 'power3.out'
        })
        if (logoElements) {
          tl.to(logoElements, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 1,
            ease: 'cubic-bezier(.21,.65,.67,1)',
            onStart: () => {
              console.log('logoElements disparait')
            }
          })
        }

        tl.to(
          orbitState.current,
          {
            height: 2,
            duration: 3,
            ease: 'power3.inout',
            onStart: () => {
              console.log('orbitState height 1')
            }
          },
          '<'
        )

        tl.addLabel('startRotation')
        tl.to(angleRef.current, {
          value: Math.PI,
          duration: 10,
          ease: "linear"
        })
        tl.to(
          carTargetPosition.current,
          {
            x: 0,
            duration: 2.5,
            ease: 'linear',
            onStart: () => {
              console.log('carTargetPosition z=0')
            }
          },
          '<'
        )
        tl.fromTo(
          '.carshow-txt-1',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power2.out'
          },
          'startRotation+=1'
        ) // 25% de 10s

        tl.to(
          '.carshow-txt-1',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power2.in'
          },
          'startRotation+=3'
        ) // disparition après 2s

        tl.fromTo(
          '.carshow-txt-2',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power2.out'
          },
          'startRotation+=4'
        ) // 50%

        tl.to(
          '.carshow-txt-2',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=5.5'
        )

        tl.fromTo(
          '.carshow-txt-3',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power3.in'
          },
          'startRotation+=6'
        ) // 50%

        tl.to(
          '.carshow-txt-3',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=8'
        )

        tl.to(
          '.carshow-txt-4 div',
          {
            autoAlpha: 1,
            duration: 2,
            y: 0,
            stagger: 0.2,
            ease: 'power3.out'
          },
          'startRotation+=10'
        ) // 50%

        tl.to(
          carTargetPosition.current,
          {
            x: 15,
            duration: 1,

            ease: 'power3.out'
          },
          'startRotation+=12'
        )
        tl.to(carTargetPosition.current, {
          // Animation vide pour laisser un temps d'arrêt après la fin de la tl
          duration: 1
        })
      })

      mm.add('(min-width: 1000px)', () => {
        // allume les lights
        gsap.to(spotLightRef2.current, {
          intensity: 1.5,
          ease: 'power3.in',
          duration: 1
        })

        gsap.to(spotLightRef1.current, {
          intensity: 2.5,
          ease: 'power3.in',
          duration: 1
        })

        gsap.to(carTargetPosition.current, {
          x: -7,
          duration: 2,

          ease: 'power3.out'
        })
        if (logoElements) {
          tl.to(logoElements, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 1,
            ease: 'cubic-bezier(.21,.65,.67,1)',
            onStart: () => {
              console.log('logoElements disparait')
            }
          })
        }

        tl.to(
          orbitState.current,
          {
            height: 1,
            duration: 3,
            ease: 'power3.inout',
            onStart: () => {
              console.log('orbitState height 1')
            }
          },
          '<'
        )

        tl.addLabel('startRotation')
        tl.to(angleRef.current, {
          value: Math.PI * 2,
          duration: 10,
          ease: CustomEase.create(
            'custom',
            'M0,0 C0.009,0.029 0.117,0.234 0.246,0.242 0.429,0.252 0.322,0.5 0.5,0.5 0.585,0.5 0.561,0.732 0.743,0.747 0.889,0.758 0.909,1 1,1 '
          )
        })
        tl.to(
          carTargetPosition.current,
          {
            x: -8.75,
            duration: 2.5,
            ease: 'linear',
            onStart: () => {
              console.log('carTargetPosition z=0')
            }
          },
          '<'
        )
        tl.fromTo(
          '.carshow-txt-1',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power2.out'
          },
          'startRotation+=1'
        ) // 25% de 10s

        tl.to(
          '.carshow-txt-1',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power2.in'
          },
          'startRotation+=3'
        ) // disparition après 2s

        tl.fromTo(
          '.carshow-txt-2',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power2.out'
          },
          'startRotation+=4'
        ) // 50%

        tl.to(
          '.carshow-txt-2',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=5.5'
        )

        tl.fromTo(
          '.carshow-txt-3',
          {
            y: 30
          },
          {
            autoAlpha: 1,
            duration: 1.5,
            y: 0,
            ease: 'power3.in'
          },
          'startRotation+=6'
        ) // 50%

        tl.to(
          '.carshow-txt-3',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=8'
        )

        tl.to(
          '.carshow-txt-4 div',
          {
            autoAlpha: 1,
            duration: 2,
            y: 0,
            stagger: 0.2,
            ease: 'power3.out'
          },
          'startRotation+=10'
        ) // 50%

        tl.to(
          carTargetPosition.current,
          {
            x: -2,
            duration: 1,

            ease: 'power3.out'
          },
          'startRotation+=10'
        )
        tl.to(carTargetPosition.current, {
          // Animation vide pour laisser un temps d'arrêt après la fin de la tl
          duration: 1
        })
      })
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [carReady, isMobile])

  // 📌 Applique progressivement la position et la rotation
  useFrame(() => {
    const angle = angleRef.current.value
    const radius = orbitState.current.radius
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = orbitState.current.height

    cameraTarget.current.set(x, y, z)

    camera.position.lerp(cameraTarget.current, 1)

    const matrix = new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, new THREE.Vector3(0, hauteurTarget, 0))
    camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(matrix), 1)

    if (carRef.current) {
      carRef.current.position.lerp(carTargetPosition.current, 0.1)
    }
  })

  // >>> LOGIQUE LENIS DÉPLACÉE DANS index.js <<<
  // Les useEffect suivants liés à Lenis (initialisation, synchronisation avec ScrollTrigger,
  // écoute de l'événement "loaded" et gestion du démarrage/arrêt) ont été retirés de ce fichier.
  // Ils sont désormais gérés dans index.js pour centraliser la logique de scroll fluide.

  // TODO Gérer l'apparition du texte et créer une animation adaptée au mobile

  return null
}
