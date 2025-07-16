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

ScrollTrigger.config({ autoRefreshEvents: '' })

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

export const CameraRigCarShow = ({ carRef, carReady, carPosition }) => {

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
    radius: 6.2
  })
  const angleRef = useRef({ value: 0 })

  useEffect(() => {
    // ✅ Rends GSAP globalement accessible
    window.gsap = gsap
    window.ScrollTrigger = ScrollTrigger

    mm.add('(min-width: 1000px)', () => {
      setIsMobile(false)
    })

    mm.add('(max-width: 999px)', () => {
      setIsMobile(true)
      console.log('go mobile')
    })
  }, [])

  useEffect(() => {
    if (!carReady || !carRef.current) return

    camera.position.set(0, 10, 5)

    const matrix = new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, new THREE.Vector3(0, hauteurTarget, 0))
    camera.quaternion.setFromRotationMatrix(matrix)
  }, [])

  useEffect(() => {

    if (document.querySelector('.carshow-container')) {
     

      if(isMobile) {

console.log('go tl mobile')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.carshow-container',
          start:'top top',
          end:  '+=3000px',
          scrub:  1 ,
          pin: true,
          pinSpacing: true,
          markers: false,
        }
      })
        orbitState.current.radius = 12


        gsap.to(carTargetPosition.current, {
          x: -1,
          duration: 2,

          ease: 'power3.out'
        })

        tl.to(
          orbitState.current,
          {
            height: 2,
            duration: 3,
            ease: 'power3.inout'
          },
          '<'
        )

        tl.addLabel('startRotation')
        tl.to(angleRef.current, {
          value: Math.PI * 2,
          duration: 11,
          ease: 'linear'
        })
        // tl.to(
        //   carTargetPosition.current,
        //   {
        //     x: 0,
        //     duration: 2.5,
        //     ease: 'linear'
        //   },
        //   '<'
        // )
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
          'startRotation+=5'
        )

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
          'startRotation+=5'
        ) // 50%

        tl.to(
          '.carshow-txt-2',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=10'
        )

       

        tl.to(
          carTargetPosition.current,
          {
            x: 15,
            duration: 1,

            ease: 'power3.out'
          },
          'startRotation+=11'
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
          '<30%'
        ) // 50%
        tl.to(carTargetPosition.current, {
          // Animation vide pour laisser un temps d'arrêt après la fin de la tl
          duration: 1
        })
            }

      if(!isMobile) {

const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.carshow-container',
          start:'top top',
          end: '+=4000px',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          markers: false,
        }
      })
        gsap.to(carTargetPosition.current, {
          x: -7,
          duration: 2,
          ease: 'power3.out'
        })

        tl.to(
          orbitState.current,
          {
            height: 1,
            duration: 3,
            ease: 'power3.inout'
          },
          '<'
        )

        tl.addLabel('startRotation')
        tl.to(angleRef.current, {
          value: Math.PI * 2,
          duration: 12,
          ease: CustomEase.create(
            'custom',
            'M0,0 C0.009,0.029 0.117,0.234 0.246,0.242 0.429,0.252 0.322,0.5 0.5,0.5 0.585,0.5 0.561,0.732 0.743,0.747 0.889,0.758 0.909,1 1,1 '
          )
        })

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
        ) 

        tl.to(
          '.carshow-txt-1',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power2.in'
          },
          'startRotation+=5'
        )
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
          'startRotation+=6'
        ) // 50%

        tl.to(
          '.carshow-txt-2',
          {
            autoAlpha: 0,
            duration: 0.5,
            y: -30,
            ease: 'power3.in'
          },
          'startRotation+=11'
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
          'startRotation+=12'
        ) // 50%

        tl.fromTo(
          carTargetPosition.current,
          {
x: -7,
          },
          {
            x: -3,
            duration: 1,

            ease: 'power3.out'
          },
          'startRotation+=11'
        )
        tl.to(carTargetPosition.current, {
          // Animation vide pour laisser un temps d'arrêt après la fin de la tl
          duration: 1
        })
             
      }
      
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

  // 📱 Correction iOS/Android : ne refresh ScrollTrigger que pour un vrai "resize" (largeur)
  useEffect(() => {
    let lastWidth = window.innerWidth

    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        ScrollTrigger.refresh()
      }
      // Si la largeur ne bouge pas : on NE FAIT RIEN, jamais, même si la hauteur change
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // >>> LOGIQUE LENIS DÉPLACÉE DANS index.js <<<
  // Les useEffect suivants liés à Lenis (initialisation, synchronisation avec ScrollTrigger,
  // écoute de l'événement "loaded" et gestion du démarrage/arrêt) ont été retirés de ce fichier.
  // Ils sont désormais gérés dans index.js pour centraliser la logique de scroll fluide.

  // TODO Gérer l'apparition du texte et créer une animation adaptée au mobile

  return null
}
