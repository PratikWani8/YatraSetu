import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Star } from "lucide-react";
import "swiper/css";

const reviews = [
  { name: "Ananya Sharma", text: "YatraSetu makes me feel safe during pilgrimage.", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Priya Kulkarni", text: "The SOS feature works instantly. Very impressive.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Sneha Patil", text: "A very smart and reliable safety platform.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Riya Mehta", text: "The live location tracking gives peace of mind.", image: "https://randomuser.me/api/portraits/women/71.jpg" },
  { name: "Kavya Nair", text: "Beautiful design and powerful features.", image: "https://randomuser.me/api/portraits/women/50.jpg" },
  { name: "Ishita Rao", text: "YatraSetu is a life-saving innovation.", image: "https://randomuser.me/api/portraits/women/32.jpg" },
  { name: "Meera Iyer", text: "Very easy to use and extremely helpful.", image: "https://randomuser.me/api/portraits/women/37.jpg" },
  { name: "Pooja Deshmukh", text: "The emergency alert is super fast.", image: "https://randomuser.me/api/portraits/women/63.jpg" },
  { name: "Aditi Singh", text: "Perfect safety companion for elders.", image: "https://randomuser.me/api/portraits/women/29.jpg" },
  { name: "Nisha Verma", text: "Highly recommend YatraSetu to everyone.", image: "https://randomuser.me/api/portraits/women/48.jpg" },
  { name: "Shruti Joshi", text: "Very secure and private platform.", image: "https://randomuser.me/api/portraits/women/26.jpg" },
  { name: "Tanvi Kapoor", text: "Great initiative for elders & women safety.", image: "https://randomuser.me/api/portraits/women/56.jpg" },
  { name: "Divya Reddy", text: "The volunteer assistance feature is amazing.", image: "https://randomuser.me/api/portraits/women/60.jpg" },
  { name: "Simran Kaur", text: "Modern and empowering solution.", image: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "Neha Choudhary", text: "I feel confident using YatraSetu daily.", image: "https://randomuser.me/api/portraits/women/41.jpg" },
];

function ReviewCard({ review }) {
  return (
    <div className="w-80 h-72 backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl 
                    p-6 flex flex-col items-center justify-between text-white 
                    shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/25">

      <img
        src={review.image}
        alt={review.name}
        className="w-20 h-20 rounded-full border-4 border-white object-cover"
      />

      <h4 className="font-semibold text-lg mt-2">
        {review.name}
      </h4>

      <p className="text-sm text-white/90 text-center px-2">
        "{review.text}"
      </p>

      <div className="flex gap-1 text-yellow-300 mt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section className="relative bg-linear-to-r from-blue-700 to-blue-500 py-24 px-6 text-center overflow-hidden">

      <h2 className="text-4xl font-bold text-white mb-16">
        What Our Users Say
      </h2>

      {/* Fade Left */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-linear-to-r from-blue-700 to-transparent z-10"></div>

      {/* Fade Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-linear-to-l from-blue-500 to-transparent z-10"></div>

      {/* First Slider (Reverse) */}
      <Swiper
  modules={[Autoplay]}
  slidesPerView="auto"
  spaceBetween={30}
  loop={true}
  loopedSlides={reviews.length}
  allowTouchMove={false}
  speed={6000}
  freeMode={true}
  freeModeMomentum={false}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
    reverseDirection: true,
  }}
  className="mb-12"
>
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="w-auto!">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Second Slider (Normal) */}
      <Swiper
  modules={[Autoplay]}
  slidesPerView="auto"
  spaceBetween={30}
  loop={true}
  loopedSlides={reviews.length}
  allowTouchMove={false}
  speed={6000}
  freeMode={true}
  freeModeMomentum={false}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  }}
>
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="w-auto!">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}

export default Reviews;