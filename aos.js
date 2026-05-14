name=aos.js
// ====================================
// SIMPLE ANIMATE ON SCROLL LIBRARY
// ====================================

(function() {
    'use strict';

    class AOS {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            this.observeElements();
            window.addEventListener('resize', () => this.observeElements());
        }

        observeElements() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !entry.target.classList.contains('aos-animated')) {
                        this.triggerAnimation(entry.target);
                        entry.target.classList.add('aos-animated');
                    }
                });
            }, options);

            document.querySelectorAll('[data-aos]').forEach((el) => {
                observer.observe(el);
            });
        }

        triggerAnimation(element) {
            const animation = element.getAttribute('data-aos') || 'fade-up';
            const delay = element.getAttribute('data-aos-delay') || 0;

            element.style.animationName = this.getAnimationName(animation);
            element.style.animationDuration = '0.6s';
            element.style.animationDelay = `${delay}ms`;
            element