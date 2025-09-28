import React from "react";
import { Link } from "react-router-dom";
import { motion, easeOut, easeInOut } from "framer-motion";
import { ShoppingCart } from "lucide-react";

// Animation Variants
const textContainerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.2 },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0 0 15px var(--color-ring)" },
  tap: { scale: 0.95 },
};

const imageVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [-3, 3, -3],
    transition: {
      y: { repeat: Infinity, duration: 2.5, ease: easeInOut },
      rotate: { repeat: Infinity, duration: 3.5, ease: easeInOut },
    },
  },
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[78vh] overflow-hidden bg-[var(--color-background)] dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8">
        {/* Left Side - Text and Button */}
        <motion.div
          className="flex flex-col justify-center items-center space-y-6"
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)]"
            variants={textItemVariants}
          >
            Elgedawy <span className="text-rose-400">Market</span>
          </motion.h1>
          <motion.p
            className="text-base text-center md:text-lg text-[var(--color-muted-foreground)] max-w-md"
            variants={textItemVariants}
          >
            Discover the latest technology products, including smartphones,
            headphones, smart watches, and more, with high quality and
            competitive prices.{" "}
          </motion.p>
          <motion.div variants={textItemVariants}>
            <Link to="/products">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn cursor-pointer btn-primary bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-border)] rounded-[var(--radius-md)] px-6 py-3 flex items-center justify-center hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-ring)] transition duration-200"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side - Images */}
        <div className="flex justify-center items-center relative h-[78vh]">
          <motion.img
            src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Smartphone"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "5%", left: "10%" }}
            variants={imageVariants}
            animate="animate"
          />
          <motion.img
            src="https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Headphones"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "5%", right: "10%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 0.2 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Smartwatch"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ bottom: "5%", left: "15%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 0.4 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300"
            alt="Laptop"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "30%", left: "5%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 0.6 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/5054213/pexels-photo-5054213.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Bluetooth Earbuds"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ bottom: "25%", right: "15%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 0.8 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Camera"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "15%", left: "30%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 1.0 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/211122/pexels-photo-211122.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Keyboard"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ bottom: "10%", right: "5%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 1.2 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Mouse"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "40%", right: "20%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 1.4 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Tablet"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "10%", left: "50%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 1.6 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/5077039/pexels-photo-5077039.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Smart Speaker"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ bottom: "20%", left: "40%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 1.8 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Monitor"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "50%", left: "25%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 2.0 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Drone"
            className="w-40 h-40 object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "25%", right: "40%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 2.4 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Smart TV"
            className="w-40 h-40 object-contain hidden md:block rounded-[var(--radius-lg)] absolute"
            style={{ bottom: "5%", left: "60%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 2.6 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Gaming Console"
            className="w-40 h-40 object-contain hidden md:block rounded-[var(--radius-lg)] absolute"
            style={{ top: "60%", left: "10%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 2.8 }}
          />
          <motion.img
            src="https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="Router"
            className="w-40 h-40 hidden md:block object-contain rounded-[var(--radius-lg)] absolute"
            style={{ top: "30%", right: "15%" }}
            variants={imageVariants}
            animate="animate"
            transition={{ delay: 3.0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
