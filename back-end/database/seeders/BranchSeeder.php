<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        Branch::insert([
            ['name'=>'Chi nhánh 1','address'=>'123 Lê Lợi','phone'=>'09010001','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 2','address'=>'456 Nguyễn Huệ','phone'=>'09010002','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 3','address'=>'789 Hai Bà Trưng','phone'=>'09010003','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 4','address'=>'12 Trần Phú','phone'=>'09010004','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 5','address'=>'34 Phan Đình Phùng','phone'=>'09010005','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 6','address'=>'56 Nguyễn Trãi','phone'=>'09010006','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 7','address'=>'78 Lý Thường Kiệt','phone'=>'09010007','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 8','address'=>'90 Cách Mạng Tháng 8','phone'=>'09010008','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 9','address'=>'11 Trần Hưng Đạo','phone'=>'09010009','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 10','address'=>'22 Lý Thái Tổ','phone'=>'09010010','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 11','address'=>'33 Phạm Ngũ Lão','phone'=>'09010011','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 12','address'=>'44 Nguyễn Du','phone'=>'09010012','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 13','address'=>'55 Hàng Bài','phone'=>'09010013','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 14','address'=>'66 Bà Triệu','phone'=>'09010014','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 15','address'=>'77 Kim Mã','phone'=>'09010015','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 16','address'=>'88 Hoàng Hoa Thám','phone'=>'09010016','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 17','address'=>'99 Trần Cung','phone'=>'09010017','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 18','address'=>'101 Cầu Giấy','phone'=>'09010018','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 19','address'=>'102 Thái Hà','phone'=>'09010019','status'=>'ACTIVE'],
            ['name'=>'Chi nhánh 20','address'=>'103 Tây Sơn','phone'=>'09010020','status'=>'ACTIVE'],
        ]);
    }
}
