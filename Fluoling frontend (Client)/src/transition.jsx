import { motion } from "framer-motion";

const transition = (PrevPage) => {
    return () => (
        <div>
            <PrevPage />
            <motion.div 
                className="coverIn"
                initial={{scaleY: 0}}
                animate={{scaleY: [0, 1, 0]}}
                exit={{scaleY: 0}}
                transition={{duration: 1, ease: [0.25, 1, 0.35, 1]}}
            />

            <motion.div
                className="coverOut"
                initial={{scaleY: 0}}
                animate={{scaleY: [0, 1, 0]}}
                exit={{scaleY: 0}}
                transition={{duration: 1, ease: [0.25, 1, 0.35, 1]}}
            />

        </div>
    );
    
};

export default transition;