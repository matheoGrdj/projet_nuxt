-- Ajout de forums
INSERT INTO forums (name, description) VALUES 
('Programmation', 'Discussions sur la programmation et le développement logiciel'),
('Technologies Web', 'Tout ce qui concerne les technologies web modernes'),
('DevOps', 'Discussions sur les pratiques DevOps, CI/CD et déploiement'),
('Mobile', 'Développement d''applications mobiles iOS et Android');

-- Ajout d'utilisateurs (avec des mots de passe hachés "password123")
INSERT INTO users (id, username, password_hash, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'john_doe', '$2a$10$RxDZUzmGcOtJ1cN4cm6SIuBwm7A6Rgm07IGjVZQZS6emzgFwsLAUC', 'user'),
('22222222-2222-2222-2222-222222222222', 'jane_smith', '$2a$10$RxDZUzmGcOtJ1cN4cm6SIuBwm7A6Rgm07IGjVZQZS6emzgFwsLAUC', 'user'),
('33333333-3333-3333-3333-333333333333', 'alex_dev', '$2a$10$RxDZUzmGcOtJ1cN4cm6SIuBwm7A6Rgm07IGjVZQZS6emzgFwsLAUC', 'user'),
('44444444-4444-4444-4444-444444444444', 'maria_tech', '$2a$10$RxDZUzmGcOtJ1cN4cm6SIuBwm7A6Rgm07IGjVZQZS6emzgFwsLAUC', 'user'),
('55555555-5555-5555-5555-555555555555', 'superadmin', '$2a$10$RxDZUzmGcOtJ1cN4cm6SIuBwm7A6Rgm07IGjVZQZS6emzgFwsLAUC', 'admin');

-- Ajout de sujets dans les forums
-- Les sujets ont besoin d'un ID d'utilisateur et d'un ID de dernier message
-- Forum 1: Programmation
INSERT INTO topics (forum_id, user_id, title, last_message_user_id) VALUES 
(1, '11111111-1111-1111-1111-111111111111', 'Comment débuter en JavaScript ?', '22222222-2222-2222-2222-222222222222'),
(1, '33333333-3333-3333-3333-333333333333', 'Les nouveautés de Python 3.10', '44444444-4444-4444-4444-444444444444'),
(1, '22222222-2222-2222-2222-222222222222', 'Programmation fonctionnelle vs OOP', '11111111-1111-1111-1111-111111111111');

-- Forum 2: Technologies Web
INSERT INTO topics (forum_id, user_id, title, last_message_user_id) VALUES 
(2, '44444444-4444-4444-4444-444444444444', 'Les avantages de Nuxt 3', '33333333-3333-3333-3333-333333333333'),
(2, '11111111-1111-1111-1111-111111111111', 'Comment optimiser les performances d''un site web', '55555555-5555-5555-5555-555555555555'),
(2, '33333333-3333-3333-3333-333333333333', 'Meilleures pratiques CSS en 2023', '22222222-2222-2222-2222-222222222222');

-- Forum 3: DevOps
INSERT INTO topics (forum_id, user_id, title, last_message_user_id) VALUES 
(3, '55555555-5555-5555-5555-555555555555', 'Docker vs Kubernetes', '44444444-4444-4444-4444-444444444444'),
(3, '22222222-2222-2222-2222-222222222222', 'CI/CD avec GitHub Actions', '11111111-1111-1111-1111-111111111111');

-- Forum 4: Mobile
INSERT INTO topics (forum_id, user_id, title, last_message_user_id) VALUES 
(4, '33333333-3333-3333-3333-333333333333', 'Flutter vs React Native', '22222222-2222-2222-2222-222222222222'),
(4, '44444444-4444-4444-4444-444444444444', 'Développement iOS avec SwiftUI', '11111111-1111-1111-1111-111111111111'),
(4, '11111111-1111-1111-1111-111111111111', 'Conseils pour publier sur le Play Store', '33333333-3333-3333-3333-333333333333');

-- Ajout de messages dans les sujets
-- Sujet 1: Comment débuter en JavaScript ?
INSERT INTO messages (topic_id, user_id, content, is_initial_message) VALUES 
(1, '11111111-1111-1111-1111-111111111111', 'Bonjour à tous, je souhaite me lancer dans l''apprentissage de JavaScript. Par où devrais-je commencer ? Quelles sont les ressources recommandées pour un débutant ? Merci d''avance pour vos conseils !', true),
(1, '33333333-3333-3333-3333-333333333333', 'Je recommande de commencer par les tutoriels sur MDN (Mozilla Developer Network). C''est une ressource très complète et fiable pour les débutants.'),
(1, '22222222-2222-2222-2222-222222222222', 'Tu peux aussi essayer le cours "JavaScript 30" de Wes Bos, il est gratuit et très pratique pour apprendre en codant de petits projets.');

-- Sujet 2: Les nouveautés de Python 3.10
INSERT INTO messages (topic_id, user_id, content, is_initial_message) VALUES 
(2, '33333333-3333-3333-3333-333333333333', 'Python 3.10 introduit plusieurs fonctionnalités intéressantes comme le pattern matching structurel et de meilleures messages d''erreur. Quelles fonctionnalités trouvez-vous les plus utiles ?', true),
(2, '55555555-5555-5555-5555-555555555555', 'J''apprécie beaucoup les messages d''erreur améliorés, ils aident vraiment à déboguer plus rapidement.'),
(2, '44444444-4444-4444-4444-444444444444', 'Le pattern matching est génial ! Ça rend le code beaucoup plus lisible pour certains cas d''utilisation.');

-- Ajout de messages pour les autres sujets (au moins le message initial)
INSERT INTO messages (topic_id, user_id, content, is_initial_message) VALUES 
(3, '22222222-2222-2222-2222-222222222222', 'J''aimerais connaître votre opinion sur les paradigmes de programmation. Préférez-vous la programmation orientée objet ou fonctionnelle, et pourquoi ?', true),
(3, '11111111-1111-1111-1111-111111111111', 'Personnellement, je préfère mixer les deux approches selon le contexte. La programmation fonctionnelle est excellente pour le traitement des données.'),
(4, '44444444-4444-4444-4444-444444444444', 'Bonjour à tous ! Je viens de découvrir Nuxt 3 et j''aimerais savoir quels sont les avantages par rapport à Vue classique ou Next.js ?', true),
(4, '33333333-3333-3333-3333-333333333333', 'J''utilise Nuxt 3 pour plusieurs projets et j''apprécie particulièrement le système de routage automatique et les composables.'),
(5, '11111111-1111-1111-1111-111111111111', 'Quelles sont vos astuces pour optimiser les performances d''un site web moderne ? Je cherche à réduire le temps de chargement de mon application.', true),
(5, '55555555-5555-5555-5555-555555555555', 'La compression des images, la minification du code et l''utilisation d''un CDN sont des bases essentielles pour l''optimisation.'),
(6, '33333333-3333-3333-3333-333333333333', 'Quelles sont selon vous les meilleures pratiques CSS à adopter en 2023 ? Utilisez-vous des frameworks ou du CSS pur ?', true),
(6, '22222222-2222-2222-2222-222222222222', 'J''ai adopté Tailwind CSS et je ne reviendrai pas en arrière. La productivité est incroyable !'),
(7, '55555555-5555-5555-5555-555555555555', 'Comparons Docker et Kubernetes : dans quelles situations utilisez-vous l''un plutôt que l''autre ?', true),
(7, '44444444-4444-4444-4444-444444444444', 'Docker pour le développement et les petits déploiements, Kubernetes quand on a besoin d''une orchestration complexe à grande échelle.'),
(8, '22222222-2222-2222-2222-222222222222', 'Comment avez-vous configuré votre pipeline CI/CD avec GitHub Actions ? Partagez vos configurations !', true),
(8, '11111111-1111-1111-1111-111111111111', 'J''utilise GitHub Actions pour exécuter mes tests, construire mes images Docker et déployer sur AWS. Je peux partager quelques workflows si ça intéresse.'),
(9, '33333333-3333-3333-3333-333333333333', 'Quel framework choisir entre Flutter et React Native pour un nouveau projet mobile multi-plateforme ?', true),
(9, '22222222-2222-2222-2222-222222222222', 'Après avoir utilisé les deux, je préfère Flutter pour sa cohérence et ses performances. La courbe d''apprentissage est un peu plus raide au début.'),
(10, '44444444-4444-4444-4444-444444444444', 'SwiftUI devient-il assez mature pour l''utiliser en production ? Partagez vos expériences !', true),
(10, '11111111-1111-1111-1111-111111111111', 'Je l''utilise depuis un an maintenant et c''est devenu très stable. Le développement est beaucoup plus rapide qu''avec UIKit.'),
(11, '11111111-1111-1111-1111-111111111111', 'Quels sont les points importants à vérifier avant de soumettre une app sur le Google Play Store ? J''ai eu plusieurs refus récemment.', true),
(11, '33333333-3333-3333-3333-333333333333', 'Assure-toi de bien respecter les règles concernant les permissions, la politique de confidentialité et les méthodes de paiement. Ce sont les points les plus sensibles.');