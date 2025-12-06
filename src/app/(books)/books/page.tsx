import Card from "../../../components/Card/Card";
import Accordion from "../../../components/Accordion/Accordion";
import TitleBar from "../../../components/TitleBar/TitleBar";
import Slider from "../../../components/ui/Slider/Slider";
import Switch from "../../../components/ui/Switch/Switch";

const page = () => {
  return (
    <div className="pt-16 bg-[#f3f5f6] min-h-screen font-[vazir]">
      <div className="w-[396px] mx-auto">
        <Card>
          <TitleBar
            iconPath="/filter.svg"
            title="همه‌ی فیلترها"
            textButton="حذف همه‌ی فیلترها"
          />
          <div className="p-5">
            <Accordion title="توصیف کلمات کلیدی">
              <span>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت
                چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
                بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و
                برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع
                با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی
                در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه
                و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری
                را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و
                فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می
                توان امید داشت که تمام و دشواری موجود در ارائه
                راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد
                نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات
                پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار
                گیرد.
              </span>
            </Accordion>
            <Accordion title="مکان مرکزی دفتر شرکت‌ها">
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing
                elit.
              </span>
            </Accordion>
            <Accordion title="نوع شرکت‌ها">
              <span>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت
                چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون
                بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.
              </span>
            </Accordion>
            <Accordion title="صنعت">
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing
                elit.
              </span>
            </Accordion>
            <Accordion title="جستجو در میان شرکت‌های مشابه">
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing
                elit.
              </span>
            </Accordion>
            <Accordion title="تکنولوژی">
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing
                elit.
              </span>
            </Accordion>
            <div className="mb-6">
              <span className="block text-right  text-[#444859]">
                تعداد کارمندان
              </span>
              <Slider isDual={true} min={0} max={100} />
            </div>
            <div className="flex mb-2 justify-between items-center">
              <Switch />
              <span className="text-[#444859]">
                فقط شرکت های خصوصی
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
